const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
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
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true
  },
  depositAmount: {
    type: Number,
    required: true
  },
  paymentDay: {
    type: Number, // Day of month (1-31)
    default: 1
  },
  terms: {
    type: String,
    required: true
  },
  document: {
    url: String,
    publicId: String
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated', 'renewed'],
    default: 'active'
  },
  signatures: {
    tenant: {
      signed: { type: Boolean, default: false },
      signedAt: Date,
      signature: String
    },
    landlord: {
      signed: { type: Boolean, default: false },
      signedAt: Date,
      signature: String
    }
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

module.exports = mongoose.model('Contract', contractSchema);
