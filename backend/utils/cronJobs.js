const cron = require('node-cron');
const Payment = require('../models/Payment');
const Contract = require('../models/Contract');
const Notification = require('../models/Notification');
const sendEmail = require('../config/email');

// Send rent reminders for upcoming payments
const sendRentReminders = async () => {
  try {
    console.log('Running rent reminder cron job...');

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Find payments due in 3 days
    const upcomingPayments = await Payment.find({
      status: 'pending',
      dueDate: {
        $gte: new Date(),
        $lte: threeDaysFromNow
      }
    })
      .populate('tenant', 'name email')
      .populate('property', 'title')
      .populate('landlord', 'name');

    for (const payment of upcomingPayments) {
      // Create in-app notification
      await Notification.create({
        user: payment.tenant._id,
        type: 'payment_due',
        title: 'Rent Payment Reminder',
        message: `Your rent of $${payment.amount} for ${payment.property.title} is due on ${payment.dueDate.toLocaleDateString()}`,
        link: `/tenant/payments/${payment._id}`,
        metadata: { paymentId: payment._id }
      });

      // Send email reminder
      try {
        await sendEmail({
          email: payment.tenant.email,
          subject: 'Rent Payment Reminder',
          message: `
            <h2>Rent Payment Reminder</h2>
            <p>Dear ${payment.tenant.name},</p>
            <p>This is a reminder that your rent payment is due soon:</p>
            <ul>
              <li><strong>Property:</strong> ${payment.property.title}</li>
              <li><strong>Amount:</strong> $${payment.amount}</li>
              <li><strong>Due Date:</strong> ${payment.dueDate.toLocaleDateString()}</li>
              <li><strong>Month:</strong> ${payment.month}</li>
            </ul>
            <p>Please ensure timely payment to avoid late fees.</p>
            <p>Thank you!</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    console.log(`Sent ${upcomingPayments.length} rent reminders`);
  } catch (error) {
    console.error('Rent reminder cron job error:', error);
  }
};

// Check for overdue payments
const checkOverduePayments = async () => {
  try {
    console.log('Checking for overdue payments...');

    const overduePayments = await Payment.updateMany(
      {
        status: 'pending',
        dueDate: { $lt: new Date() }
      },
      {
        $set: { status: 'overdue' }
      }
    );

    // Get overdue payments to send notifications
    const overdueList = await Payment.find({
      status: 'overdue'
    })
      .populate('tenant', 'name email')
      .populate('property', 'title');

    for (const payment of overdueList) {
      // Create notification
      await Notification.create({
        user: payment.tenant._id,
        type: 'payment_overdue',
        title: 'Payment Overdue',
        message: `Your rent payment of $${payment.amount} is overdue`,
        link: `/tenant/payments/${payment._id}`,
        metadata: { paymentId: payment._id }
      });
    }

    console.log(`Marked ${overduePayments.modifiedCount} payments as overdue`);
  } catch (error) {
    console.error('Overdue payments cron job error:', error);
  }
};

// Check for expiring contracts
const checkExpiringContracts = async () => {
  try {
    console.log('Checking for expiring contracts...');

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringContracts = await Contract.find({
      status: 'active',
      endDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      }
    })
      .populate('tenant', 'name email')
      .populate('landlord', 'name email')
      .populate('property', 'title');

    for (const contract of expiringContracts) {
      // Notify tenant
      await Notification.create({
        user: contract.tenant._id,
        type: 'contract_expiring',
        title: 'Contract Expiring Soon',
        message: `Your contract for ${contract.property.title} expires on ${contract.endDate.toLocaleDateString()}`,
        link: `/tenant/contracts/${contract._id}`,
        metadata: { contractId: contract._id }
      });

      // Notify landlord
      await Notification.create({
        user: contract.landlord._id,
        type: 'contract_expiring',
        title: 'Contract Expiring Soon',
        message: `Contract for ${contract.property.title} expires on ${contract.endDate.toLocaleDateString()}`,
        link: `/landlord/contracts/${contract._id}`,
        metadata: { contractId: contract._id }
      });

      // Send email to tenant
      try {
        await sendEmail({
          email: contract.tenant.email,
          subject: 'Contract Expiring Soon',
          message: `
            <h2>Contract Expiration Notice</h2>
            <p>Dear ${contract.tenant.name},</p>
            <p>Your rental contract is expiring soon:</p>
            <ul>
              <li><strong>Property:</strong> ${contract.property.title}</li>
              <li><strong>Expiration Date:</strong> ${contract.endDate.toLocaleDateString()}</li>
            </ul>
            <p>Please contact your landlord if you wish to renew the contract.</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    console.log(`Found ${expiringContracts.length} expiring contracts`);
  } catch (error) {
    console.error('Expiring contracts cron job error:', error);
  }
};

// Generate monthly rent payments
const generateMonthlyRentPayments = async () => {
  try {
    console.log('Generating monthly rent payments...');

    const activeContracts = await Contract.find({ status: 'active' });
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);

    for (const contract of activeContracts) {
      // Check if payment already exists for current month
      const existingPayment = await Payment.findOne({
        contract: contract._id,
        month: currentMonth
      });

      if (!existingPayment) {
        // Calculate due date based on payment day
        const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), contract.paymentDay);

        await Payment.create({
          tenant: contract.tenant,
          landlord: contract.landlord,
          property: contract.property,
          contract: contract._id,
          amount: contract.rentAmount,
          type: 'rent',
          month: currentMonth,
          dueDate,
          status: 'pending'
        });

        console.log(`Created rent payment for contract ${contract._id}`);
      }
    }
  } catch (error) {
    console.error('Generate monthly payments error:', error);
  }
};

// Start all cron jobs
const startCronJobs = () => {
  // Run daily at 9 AM - Send rent reminders
  cron.schedule('0 9 * * *', sendRentReminders);

  // Run daily at 1 AM - Check overdue payments
  cron.schedule('0 1 * * *', checkOverduePayments);

  // Run daily at 8 AM - Check expiring contracts
  cron.schedule('0 8 * * *', checkExpiringContracts);

  // Run on 1st of every month at midnight - Generate monthly payments
  cron.schedule('0 0 1 * *', generateMonthlyRentPayments);

  console.log('✅ Cron jobs scheduled successfully');
};

module.exports = { startCronJobs };
