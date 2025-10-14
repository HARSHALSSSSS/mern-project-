const Contract = require('../models/Contract');
const Application = require('../models/Application');
const Property = require('../models/Property');
const Payment = require('../models/Payment');

// @desc    Create contract
// @route   POST /api/contracts
// @access  Private/Landlord/Admin
exports.createContract = async (req, res) => {
  try {
    const { applicationId, startDate, endDate, rentAmount, depositAmount, paymentDay, terms } = req.body;

    const application = await Application.findById(applicationId)
      .populate('property')
      .populate('tenant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Application must be approved first'
      });
    }

    const contract = await Contract.create({
      tenant: application.tenant._id,
      landlord: application.landlord,
      property: application.property._id,
      application: applicationId,
      startDate,
      endDate,
      rentAmount,
      depositAmount,
      paymentDay,
      terms
    });

    // Update property availability
    const property = await Property.findById(application.property._id);
    property.availability = 'occupied';
    await property.save();

    // Create initial payment (deposit)
    await Payment.create({
      tenant: application.tenant._id,
      landlord: application.landlord,
      property: application.property._id,
      contract: contract._id,
      amount: depositAmount,
      type: 'deposit',
      month: new Date(startDate).toISOString().slice(0, 7),
      dueDate: startDate,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all contracts
// @route   GET /api/contracts
// @access  Private
exports.getAllContracts = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    } else if (req.user.role === 'landlord') {
      query.landlord = req.user._id;
    }

    const { status, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;

    const contracts = await Contract.find(query)
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .populate('property', 'title address images')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Contract.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      contracts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get contract by ID
// @route   GET /api/contracts/:id
// @access  Private
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('tenant')
      .populate('landlord')
      .populate('property')
      .populate('application');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    res.status(200).json({
      success: true,
      contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update contract
// @route   PUT /api/contracts/:id
// @access  Private/Landlord/Admin
exports.updateContract = async (req, res) => {
  try {
    let contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Contract updated successfully',
      contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Terminate contract
// @route   PUT /api/contracts/:id/terminate
// @access  Private/Landlord/Admin
exports.terminateContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    contract.status = 'terminated';
    await contract.save();

    // Update property availability
    await Property.findByIdAndUpdate(contract.property, {
      availability: 'available'
    });

    res.status(200).json({
      success: true,
      message: 'Contract terminated successfully',
      contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
