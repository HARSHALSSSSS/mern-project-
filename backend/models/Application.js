const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  moveInDate: {
    type: Date,
    required: true
  },
  leaseDuration: {
    type: Number, // in months
    required: true
  },
  employmentInfo: {
    employer: String,
    position: String,
    monthlyIncome: Number
  },
  references: [{
    name: String,
    phone: String,
    relationship: String
  }],
  documents: [{
    type: String,
    url: String
  }],
  rejectionReason: {
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

module.exports = mongoose.model('Application', applicationSchema);
