const Application = require('../models/Application');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const createAuditLog = require('../middleware/auditLog');

// @desc    Create application
// @route   POST /api/applications
// @access  Private/Tenant
exports.createApplication = async (req, res) => {
  try {
    console.log('📝 Create Application Request:', {
      body: req.body,
      user: req.user ? { id: req.user._id, role: req.user.role, name: req.user.name } : 'No user',
      hasToken: !!req.headers.authorization
    });
    
    const { propertyId, message, moveInDate, leaseDuration, employmentInfo, references } = req.body;

    if (!propertyId) {
      console.log('❌ No propertyId provided');
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.availability !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Property is not available'
      });
    }

    // Check for existing application
    const existingApplication = await Application.findOne({
      tenant: req.user._id,
      property: propertyId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active application for this property'
      });
    }

    const application = await Application.create({
      tenant: req.user._id,
      property: propertyId,
      landlord: property.landlord,
      message,
      moveInDate,
      leaseDuration,
      employmentInfo,
      references
    });

    // Create notification for landlord
    await Notification.create({
      user: property.landlord,
      type: 'application_received',
      title: 'New Rental Application',
      message: `${req.user.name} applied for ${property.title}`,
      link: `/landlord/applications/${application._id}`,
      metadata: { applicationId: application._id, propertyId: property._id }
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(property.landlord.toString()).emit('notification', {
      type: 'application_received',
      message: `New application for ${property.title}`
    });

    await createAuditLog(
      req,
      'application_create',
      `Tenant ${req.user.name} applied for ${property.title}`,
      { applicationId: application._id, propertyId: property._id }
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('❌ Create Application Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
exports.getAllApplications = async (req, res) => {
  try {
    console.log('📋 Get All Applications - User:', { 
      id: req.user._id, 
      role: req.user.role,
      name: req.user.name 
    });
    
    let query = {};

    if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    } else if (req.user.role === 'landlord') {
      query.landlord = req.user._id;
    }
    
    console.log('📋 Application query:', query);

    const { status, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('tenant', 'name email phone')
      .populate('property', 'title address rent images')
      .populate('landlord', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Application.countDocuments(query);
    
    console.log('✅ Applications found:', { 
      count, 
      returned: applications.length,
      statuses: applications.map(a => ({ id: a._id, status: a.status, property: a.property?.title }))
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      applications
    });
  } catch (error) {
    console.error('❌ Get Applications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('tenant', 'name email phone address')
      .populate('property')
      .populate('landlord', 'name email phone');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      application.tenant._id.toString() !== req.user._id.toString() &&
      application.landlord._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Landlord
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('property')
      .populate('tenant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    if (application.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.status = status;
    if (status === 'rejected' && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }
    await application.save();

    // Create notification for tenant
    await Notification.create({
      user: application.tenant._id,
      type: status === 'approved' ? 'application_approved' : 'application_rejected',
      title: `Application ${status}`,
      message: `Your application for ${application.property.title} has been ${status}`,
      link: `/tenant/applications/${application._id}`,
      metadata: { applicationId: application._id }
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(application.tenant._id.toString()).emit('notification', {
      type: `application_${status}`,
      message: `Application ${status} for ${application.property.title}`
    });

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private/Tenant
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending applications'
      });
    }

    application.status = 'withdrawn';
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
