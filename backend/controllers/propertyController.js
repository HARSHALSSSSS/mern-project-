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
    
    // Log the request for debugging
    console.log('📋 GET /api/properties - Request:', {
      user: req.user ? { id: req.user._id, role: req.user.role } : 'Not authenticated',
      approvalStatus,
      hasApprovalStatusParam: !!approvalStatus
    });
    
    // Approval status filtering logic:
    // 1. If approvalStatus is explicitly specified in query, use it
    // 2. If user is admin and no approvalStatus specified, show ALL properties
    // 3. If user is not admin (or not logged in), only show 'approved' properties
    if (approvalStatus) {
      query.approvalStatus = approvalStatus;
    } else if (!req.user || req.user.role !== 'admin') {
      query.approvalStatus = 'approved';  // Non-admin users only see approved
    }
    // If admin and no approvalStatus specified, query.approvalStatus remains undefined = show all
    
    console.log('🔍 Query filter:', query);

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
    
    console.log('✅ Properties found:', {
      count,
      totalInDB: await Property.countDocuments({}),
      returned: properties.length,
      statuses: properties.map(p => p.approvalStatus),
      landlordPopulated: properties.map(p => ({ 
        id: p._id, 
        title: p.title,
        landlordId: p.landlord?._id,
        landlordName: p.landlord?.name,
        hasLandlord: !!p.landlord 
      }))
    });

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
    // DEBUGGING: Log all request details
    console.log('📸 CREATE PROPERTY - REQUEST DETAILS:');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Files length:', req.files?.length);
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);

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
      console.log('✅ IMAGES RECEIVED! Count:', req.files.length);
      
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        // Upload to Cloudinary for production
        console.log('☁️ Uploading to Cloudinary...');
        propertyData.images = await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'real-estate-properties',
              resource_type: 'auto'
            });
            return {
              url: result.secure_url,
              publicId: result.public_id
            };
          })
        );
        console.log('☁️ Cloudinary upload complete');
      } else {
        // Fallback to local uploads for development
        console.log('💾 Using local uploads (development mode)');
        propertyData.images = req.files.map(file => ({
          url: `/uploads/${file.filename}`,
          publicId: file.filename
        }));
      }
      console.log('📷 Saved image paths:', propertyData.images);
    } else {
      console.log('⚠️ NO FILES RECEIVED - req.files:', req.files);
      propertyData.images = [];
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
    console.log('📸 UPDATE PROPERTY - REQUEST DETAILS:');
    console.log('Property ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Files length:', req.files?.length);

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
      console.log('✅ NEW IMAGES RECEIVED! Count:', req.files.length);
      
      let newImages;
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        // Upload to Cloudinary
        console.log('☁️ Uploading to Cloudinary...');
        newImages = await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'real-estate-properties',
              resource_type: 'auto'
            });
            return {
              url: result.secure_url,
              publicId: result.public_id
            };
          })
        );
      } else {
        // Fallback to local uploads
        console.log('💾 Using local uploads (development mode)');
        newImages = req.files.map(file => ({
          url: `/uploads/${file.filename}`,
          publicId: file.filename
        }));
      }
      
      req.body.images = [...(property.images || []), ...newImages];
      console.log('📷 Updated image paths:', req.body.images);
    } else {
      console.log('⚠️ NO NEW FILES - keeping existing images');
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
      properties: properties  // Changed from 'data' to 'properties' for consistency
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
