const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['rent', 'deposit', 'maintenance', 'late_fee', 'other'],
    default: 'rent'
  },
  month: {
    type: String, // Format: YYYY-MM
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'cash', 'cheque', 'online'],
    default: 'online'
  },
  transactionId: {
    type: String
  },
  stripePaymentIntentId: {
    type: String
  },
  receipt: {
    url: String,
    publicId: String
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster queries
paymentSchema.index({ tenant: 1, month: 1 });
paymentSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
