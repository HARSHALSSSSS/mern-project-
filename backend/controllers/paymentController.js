const Payment = require('../models/Payment');
const Contract = require('../models/Contract');
const Notification = require('../models/Notification');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment
// @route   POST /api/payments
// @access  Private/Admin/Landlord
exports.createPayment = async (req, res) => {
  try {
    const { contractId, amount, type, month, dueDate } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    const payment = await Payment.create({
      tenant: contract.tenant,
      landlord: contract.landlord,
      property: contract.property,
      contract: contractId,
      amount,
      type,
      month,
      dueDate
    });

    // Create notification
    await Notification.create({
      user: contract.tenant,
      type: 'payment_due',
      title: 'Rent Payment Due',
      message: `Rent of $${amount} is due on ${new Date(dueDate).toLocaleDateString()}`,
      link: `/tenant/payments/${payment._id}`,
      metadata: { paymentId: payment._id }
    });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getAllPayments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    } else if (req.user.role === 'landlord') {
      query.landlord = req.user._id;
    }

    const { status, type, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;
    if (type) query.type = type;

    const payments = await Payment.find(query)
      .populate('tenant', 'name email')
      .populate('landlord', 'name email')
      .populate('property', 'title address')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: -1 });

    const count = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .populate('property')
      .populate('contract');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Process payment (Stripe)
// @route   POST /api/payments/:id/process
// @access  Private/Tenant
exports.processPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('property', 'title');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        paymentId: payment._id.toString(),
        tenantId: payment.tenant.toString(),
        propertyTitle: payment.property.title
      }
    });

    payment.stripePaymentIntentId = paymentIntent.id;
    await payment.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Confirm payment
// @route   PUT /api/payments/:id/confirm
// @access  Private/Tenant
exports.confirmPayment = async (req, res) => {
  try {
    const { transactionId, paymentMethod } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.transactionId = transactionId;
    payment.paymentMethod = paymentMethod || 'online';
    await payment.save();

    // Create notification for landlord
    await Notification.create({
      user: payment.landlord,
      type: 'payment_received',
      title: 'Payment Received',
      message: `Received $${payment.amount} rent payment for ${payment.month}`,
      link: `/landlord/payments/${payment._id}`,
      metadata: { paymentId: payment._id }
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(payment.landlord.toString()).emit('notification', {
      type: 'payment_received',
      message: `Rent payment received for ${payment.month}`
    });

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update payment status (Admin)
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = status;
    if (notes) payment.notes = notes;
    if (status === 'paid' && !payment.paidDate) {
      payment.paidDate = new Date();
    }
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
