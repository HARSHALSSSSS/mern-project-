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
      isActive: true
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

module.exports = router;