const express = require('express');
const router = express.Router();
const {
  getTenantDashboard,
  getLandlordDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/tenant', protect, authorize('tenant'), getTenantDashboard);
router.get('/landlord', protect, authorize('landlord'), getLandlordDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
