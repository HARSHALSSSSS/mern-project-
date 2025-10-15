const Property = require('../models/Property');
const createAuditLog = require('../middleware/auditLog');
const cloudinary = require('../config/cloudinary');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getAllProperties = async (req, res) => {
  try {
    const {
      type,
      city,
      minRent,
      maxRent,
      bedrooms,
      bathrooms,
      availability,
      approvalStatus,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    
    // If approvalStatus is not specified, default to 'approved' for public access
    // If specified (e.g., by admin), use the specified value
    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    } else if (!req.user || req.user.role !== 'admin') {
      query.approvalStatus = 'approved';
    }

    if (type) query.type = type;
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (minRent || maxRent) {
      query['rent.amount'] = {};
      if (minRent) query['rent.amount'].$gte = Number(minRent);
      if (maxRent) query['rent.amount'].$lte = Number(maxRent);
    }
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    if (availability) query.availability = availability;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(query)
      .populate('landlord', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const count = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'name email phone avatar');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private/Landlord
exports.createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      landlord: req.user._id
    };

    // Parse JSON strings from FormData
    if (typeof propertyData.rent === 'string') {
      propertyData.rent = JSON.parse(propertyData.rent);
    }
    if (typeof propertyData.address === 'string') {
      propertyData.address = JSON.parse(propertyData.address);
    }
    if (typeof propertyData.area === 'string') {
      propertyData.area = JSON.parse(propertyData.area);
    }
    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = JSON.parse(propertyData.amenities);
    }
    if (typeof propertyData.utilities === 'string') {
      propertyData.utilities = JSON.parse(propertyData.utilities);
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename
      }));
    }

    const property = await Property.create(propertyData);

    await createAuditLog(
      req,
      'property_create',
      `Landlord ${req.user.name} created property: ${property.title}`,
      { propertyId: property._id }
    );

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Landlord
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership or admin
    if (property.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename
      }));
      req.body.images = [...(property.images || []), ...newImages];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await createAuditLog(
      req,
      'property_update',
      `${req.user.name} updated property: ${property.title}`,
      { propertyId: property._id }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Landlord
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership or admin
    if (property.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await property.deleteOne();

    await createAuditLog(
      req,
      'property_delete',
      `${req.user.name} deleted property: ${property.title}`,
      { propertyId: property._id }
    );

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get landlord's properties
// @route   GET /api/properties/landlord/my-properties
// @access  Private/Landlord
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve/Reject property (Admin)
// @route   PUT /api/properties/:id/approval
// @access  Private/Admin
exports.updatePropertyApproval = async (req, res) => {
  try {
    const { approvalStatus } = req.body;

    if (!['approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid approval status'
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.approvalStatus = approvalStatus;
    await property.save();

    // Create notification for landlord
    const Notification = require('../models/Notification');
    await Notification.create({
      user: property.landlord,
      type: approvalStatus === 'approved' ? 'property_approved' : 'property_rejected',
      title: `Property ${approvalStatus}`,
      message: `Your property "${property.title}" has been ${approvalStatus}`,
      link: `/properties/${property._id}`
    });

    res.status(200).json({
      success: true,
      message: `Property ${approvalStatus} successfully`,
      property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
