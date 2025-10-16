const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// @desc    Create initial admin user (ONE TIME ONLY)
// @route   POST /api/setup/admin
// @access  Public (but only works if no admin exists)
router.post('/admin', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@realestate.com',
      password: 'admin123', // Will be hashed automatically by User model
      role: 'admin',
      phone: '+1234567890',
      status: 'active'  // Fixed: was 'isActive: true' which is wrong field name
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Fix existing admin user status (ONE TIME FIX)
// @route   POST /api/setup/fix-admin
// @access  Public (temporary fix endpoint)
router.post('/fix-admin', async (req, res) => {
  try {
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@realestate.com' });
    
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found. Please create admin first using /api/setup/admin'
      });
    }

    // Update the admin user status
    adminUser.status = 'active';
    await adminUser.save();

    res.status(200).json({
      success: true,
      message: 'Admin user status fixed successfully',
      admin: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        status: adminUser.status
      }
    });

  } catch (error) {
    console.error('Admin fix error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get database stats (for debugging)
// @route   GET /api/setup/db-stats
// @access  Public (temporary for debugging)
router.get('/db-stats', async (req, res) => {
  try {
    const User = require('../models/User');
    const Property = require('../models/Property');
    const Application = require('../models/Application');

    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ approvalStatus: 'pending' });
    const approvedProperties = await Property.countDocuments({ approvalStatus: 'approved' });
    const rejectedProperties = await Property.countDocuments({ approvalStatus: 'rejected' });
    
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    // Get all properties with basic info
    const allProperties = await Property.find({})
      .select('title approvalStatus createdAt landlord')
      .populate('landlord', 'name email');
      
    // Get all applications with basic info
    const allApplications = await Application.find({})
      .select('status createdAt tenant property landlord')
      .populate('tenant', 'name email')
      .populate('property', 'title')
      .populate('landlord', 'name email');

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalApplications,
        pendingApplications
      },
      properties: allProperties.map(p => ({
        id: p._id,
        title: p.title,
        status: p.approvalStatus,
        landlord: p.landlord?.name,
        landlordId: p.landlord?._id,
        createdAt: p.createdAt
      })),
      applications: allApplications.map(a => ({
        id: a._id,
        property: a.property?.title,
        tenant: a.tenant?.name,
        tenantEmail: a.tenant?.email,
        landlord: a.landlord?.name,
        landlordEmail: a.landlord?.email,
        landlordId: a.landlord?._id,
        status: a.status,
        createdAt: a.createdAt
      }))
    });

  } catch (error) {
    console.error('DB stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Check current logged in user (for debugging)
// @route   GET /api/setup/whoami  
// @access  Public
router.get('/whoami', async (req, res) => {
  try {
    // Try to get user from token if provided
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        message: 'No token provided - not logged in'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        message: 'Token invalid - user not found'
      });
    }

    res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      message: `You are logged in as: ${user.name} (${user.role})`
    });

  } catch (error) {
    console.error('WhoAmI error:', error);
    res.status(200).json({
      success: false,
      authenticated: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
});

module.exports = router;