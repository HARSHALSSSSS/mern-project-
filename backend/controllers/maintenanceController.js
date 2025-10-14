const Maintenance = require('../models/Maintenance');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Private/Tenant
exports.createMaintenance = async (req, res) => {
  try {
    const { propertyId, title, description, category, priority } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const maintenance = await Maintenance.create({
      tenant: req.user._id,
      property: propertyId,
      landlord: property.landlord,
      title,
      description,
      category,
      priority
    });

    // Create notification for landlord
    await Notification.create({
      user: property.landlord,
      type: 'maintenance_created',
      title: 'New Maintenance Request',
      message: `${req.user.name} submitted a ${priority} priority maintenance request`,
      link: `/landlord/maintenance/${maintenance._id}`,
      metadata: { maintenanceId: maintenance._id }
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(property.landlord.toString()).emit('notification', {
      type: 'maintenance_created',
      message: `New maintenance request: ${title}`
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private
exports.getAllMaintenance = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    } else if (req.user.role === 'landlord') {
      query.landlord = req.user._id;
    }

    const { status, priority, category, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const maintenanceRequests = await Maintenance.find(query)
      .populate('tenant', 'name email phone')
      .populate('property', 'title address')
      .populate('landlord', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Maintenance.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      maintenanceRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get maintenance by ID
// @route   GET /api/maintenance/:id
// @access  Private
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate('tenant', 'name email phone')
      .populate('property')
      .populate('landlord', 'name email phone')
      .populate('notes.user', 'name');

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.status(200).json({
      success: true,
      maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update maintenance status
// @route   PUT /api/maintenance/:id/status
// @access  Private/Landlord/Admin
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status, assignedTo, estimatedCost, actualCost, scheduledDate } = req.body;

    const maintenance = await Maintenance.findById(req.params.id)
      .populate('tenant');

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    if (status) maintenance.status = status;
    if (assignedTo) maintenance.assignedTo = assignedTo;
    if (estimatedCost) maintenance.estimatedCost = estimatedCost;
    if (actualCost) maintenance.actualCost = actualCost;
    if (scheduledDate) maintenance.scheduledDate = scheduledDate;
    if (status === 'completed') maintenance.completedDate = new Date();

    await maintenance.save();

    // Create notification for tenant
    await Notification.create({
      user: maintenance.tenant._id,
      type: 'maintenance_updated',
      title: 'Maintenance Request Updated',
      message: `Your maintenance request status changed to ${status}`,
      link: `/tenant/maintenance/${maintenance._id}`,
      metadata: { maintenanceId: maintenance._id }
    });

    res.status(200).json({
      success: true,
      message: 'Maintenance request updated successfully',
      maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add note to maintenance
// @route   POST /api/maintenance/:id/notes
// @access  Private
exports.addMaintenanceNote = async (req, res) => {
  try {
    const { message } = req.body;

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    maintenance.notes.push({
      user: req.user._id,
      message
    });

    await maintenance.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      maintenance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
