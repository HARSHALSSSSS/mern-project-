const express = require('express');
const router = express.Router();
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('tenant'), createApplication);
router.get('/', protect, getAllApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('landlord', 'admin'), updateApplicationStatus);
router.put('/:id/withdraw', protect, authorize('tenant'), withdrawApplication);

module.exports = router;
