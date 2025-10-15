const Property = require('../models/Property');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const Contract = require('../models/Contract');
const User = require('../models/User');

// @desc    Get tenant dashboard data
// @route   GET /api/dashboard/tenant
// @access  Private/Tenant
exports.getTenantDashboard = async (req, res) => {
  try {
    console.log('📊 Fetching tenant dashboard for user:', req.user._id);
    
    // Active contracts
    const activeContracts = await Contract.find({
      tenant: req.user._id,
      status: 'active'
    }).populate('property', 'title address images');

    // Recent applications (all statuses)
    const recentApplications = await Application.find({
      tenant: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('property', 'title address images rent');
    
    console.log('📋 Recent applications found:', recentApplications.length);

    // Pending applications count
    const pendingApplications = await Application.countDocuments({
      tenant: req.user._id,
      status: 'pending'
    });

    // Payments due
    const paymentsDue = await Payment.find({
      tenant: req.user._id,
      status: 'pending',
      dueDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // Next 7 days
    }).populate('property', 'title');

    // Recent maintenance requests
    const maintenanceRequests = await Maintenance.find({
      tenant: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('property', 'title');

    // Payment history (last 6 months)
    const paymentHistory = await Payment.aggregate([
      {
        $match: {
          tenant: req.user._id,
          status: 'paid'
        }
      },
      {
        $group: {
          _id: '$month',
          totalPaid: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        activeContracts,
        recentApplications,
        pendingApplications,
        paymentsDue,
        maintenanceRequests,
        paymentHistory,
        stats: {
          activeRentals: activeContracts.length,
          totalContracts: activeContracts.length,
          pendingApplications,
          upcomingPayments: paymentsDue.length,
          maintenanceCount: maintenanceRequests.length,
          maintenanceRequests: maintenanceRequests.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get landlord dashboard data
// @route   GET /api/dashboard/landlord
// @access  Private/Landlord
exports.getLandlordDashboard = async (req, res) => {
  try {
    // Total properties
    const totalProperties = await Property.countDocuments({
      landlord: req.user._id
    });

    // Occupied properties
    const occupiedProperties = await Property.countDocuments({
      landlord: req.user._id,
      availability: 'occupied'
    });

    // Pending applications
    const pendingApplications = await Application.find({
      landlord: req.user._id,
      status: 'pending'
    })
      .populate('tenant', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent payments
    const recentPayments = await Payment.find({
      landlord: req.user._id,
      status: 'paid'
    })
      .populate('tenant', 'name')
      .populate('property', 'title')
      .sort({ paidDate: -1 })
      .limit(10);

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          landlord: req.user._id,
          status: 'paid'
        }
      },
      {
        $group: {
          _id: '$month',
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 6 }
    ]);

    // Maintenance requests
    const maintenanceRequests = await Maintenance.find({
      landlord: req.user._id,
      status: { $in: ['pending', 'in_progress'] }
    })
      .populate('tenant', 'name')
      .populate('property', 'title')
      .sort({ priority: -1, createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProperties,
          occupiedProperties,
          availableProperties: totalProperties - occupiedProperties,
          pendingApplications: pendingApplications.length,
          activeMaintenance: maintenanceRequests.length
        },
        pendingApplications,
        recentPayments,
        monthlyRevenue,
        maintenanceRequests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalLandlords = await User.countDocuments({ role: 'landlord' });
    const totalProperties = await Property.countDocuments();
    const activeContracts = await Contract.countDocuments({ status: 'active' });
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    // Revenue stats
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Monthly revenue trend (last 12 months)
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: '$month',
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    // Property statistics
    const propertyStats = await Property.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activities
    const recentApplications = await Application.find()
      .populate('tenant', 'name')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await Payment.find({ status: 'paid' })
      .populate('tenant', 'name')
      .populate('property', 'title')
      .sort({ paidDate: -1 })
      .limit(5);

    // Pending approvals
    const pendingProperties = await Property.find({ approvalStatus: 'pending' })
      .populate('landlord', 'name email')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTenants,
          totalLandlords,
          totalProperties,
          activeContracts,
          pendingApplications,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        monthlyRevenue,
        propertyStats,
        recentApplications,
        recentPayments,
        pendingProperties
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
