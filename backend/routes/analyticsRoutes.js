const express = require('express');
const router = express.Router();
const {
  getOccupancyRate,
  getRentCollectionTrend,
  getMaintenanceCompletionRate,
  getRevenueAnalytics,
  getPropertyPerformance
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/occupancy', protect, authorize('landlord', 'admin'), getOccupancyRate);
router.get('/rent-collection', protect, authorize('landlord', 'admin'), getRentCollectionTrend);
router.get('/maintenance-completion', protect, authorize('landlord', 'admin'), getMaintenanceCompletionRate);
router.get('/revenue', protect, authorize('landlord', 'admin'), getRevenueAnalytics);
router.get('/property-performance', protect, authorize('landlord', 'admin'), getPropertyPerformance);

module.exports = router;
