const AuditLog = require('../models/AuditLog');

const createAuditLog = async (req, action, description, metadata = {}) => {
  try {
    await AuditLog.create({
      user: req.user ? req.user._id : null,
      action,
      description,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      metadata
    });
  } catch (error) {
    console.error('Audit log creation error:', error);
  }
};

module.exports = createAuditLog;
