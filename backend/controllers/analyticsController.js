const Property = require('../models/Property');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const Contract = require('../models/Contract');

// @desc    Get occupancy rate analytics
// @route   GET /api/analytics/occupancy
// @access  Private/Landlord/Admin
exports.getOccupancyRate = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'landlord') {
      query.landlord = req.user._id;
    }

    const totalProperties = await Property.countDocuments(query);
    const occupiedProperties = await Property.countDocuments({
      ...query,
      availability: 'occupied'
    });
    const availableProperties = await Property.countDocuments({
      ...query,
      availability: 'available'
    });

    const occupancyRate = totalProperties > 0
      ? ((occupiedProperties / totalProperties) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        occupiedProperties,
        availableProperties,
        occupancyRate: parseFloat(occupancyRate)
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

// @desc    Get rent collection trend
// @route   GET /api/analytics/rent-collection
// @access  Private/Landlord/Admin
exports.getRentCollectionTrend = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    let matchQuery = {};

    if (req.user.role === 'landlord') {
      matchQuery.landlord = req.user._id;
    }

    const collectionData = await Payment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            month: '$month',
            status: '$status'
          },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': -1 } },
      { $limit: parseInt(months) * 3 } // Multiply by statuses
    ]);

    // Organize by month
    const monthlyData = {};
    collectionData.forEach(item => {
      const month = item._id.month;
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          paid: 0,
          pending: 0,
          overdue: 0,
          paidCount: 0,
          pendingCount: 0,
          overdueCount: 0
        };
      }
      monthlyData[month][item._id.status] = item.amount;
      monthlyData[month][`${item._id.status}Count`] = item.count;
    });

    const trend = Object.values(monthlyData).sort((a, b) => 
      b.month.localeCompare(a.month)
    );

    res.status(200).json({
      success: true,
      data: trend
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get maintenance completion rate
// @route   GET /api/analytics/maintenance-completion
// @access  Private/Landlord/Admin
exports.getMaintenanceCompletionRate = async (req, res) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'landlord') {
      matchQuery.landlord = req.user._id;
    }

    const maintenanceStats = await Maintenance.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = maintenanceStats.reduce((sum, item) => sum + item.count, 0);
    const completed = maintenanceStats.find(item => item._id === 'completed')?.count || 0;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

    // Average resolution time
    const completedRequests = await Maintenance.find({
      ...matchQuery,
      status: 'completed'
    }).select('createdAt completedDate');

    let avgResolutionDays = 0;
    if (completedRequests.length > 0) {
      const totalDays = completedRequests.reduce((sum, req) => {
        const days = Math.floor(
          (new Date(req.completedDate) - new Date(req.createdAt)) / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0);
      avgResolutionDays = (totalDays / completedRequests.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending: maintenanceStats.find(item => item._id === 'pending')?.count || 0,
        inProgress: maintenanceStats.find(item => item._id === 'in_progress')?.count || 0,
        completionRate: parseFloat(completionRate),
        avgResolutionDays: parseFloat(avgResolutionDays)
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

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Landlord/Admin
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    let matchQuery = { status: 'paid' };

    if (req.user.role === 'landlord') {
      matchQuery.landlord = req.user._id;
    }

    const revenueData = await Payment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        breakdown: revenueData,
        byType: revenueData.map(item => ({
          type: item._id,
          amount: item.totalAmount,
          percentage: ((item.totalAmount / totalRevenue) * 100).toFixed(2)
        }))
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

// @desc    Get property performance
// @route   GET /api/analytics/property-performance
// @access  Private/Landlord/Admin
exports.getPropertyPerformance = async (req, res) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'landlord') {
      matchQuery.landlord = req.user._id;
    }

    const properties = await Property.find(matchQuery).select('title');
    const performanceData = await Promise.all(
      properties.map(async (property) => {
        const revenue = await Payment.aggregate([
          {
            $match: {
              property: property._id,
              status: 'paid'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        const maintenanceCost = await Maintenance.aggregate([
          {
            $match: {
              property: property._id,
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$actualCost' }
            }
          }
        ]);

        return {
          propertyId: property._id,
          title: property.title,
          revenue: revenue[0]?.total || 0,
          maintenanceCost: maintenanceCost[0]?.total || 0,
          netIncome: (revenue[0]?.total || 0) - (maintenanceCost[0]?.total || 0)
        };
      })
    );

    res.status(200).json({
      success: true,
      data: performanceData.sort((a, b) => b.netIncome - a.netIncome)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
