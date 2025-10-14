const express = require('express');
const router = express.Router();
const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenanceStatus,
  addMaintenanceNote
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

router.post('/', protect, authorize('tenant'), upload.array('images', 5), createMaintenance);
router.get('/', protect, getAllMaintenance);
router.get('/:id', protect, getMaintenanceById);
router.put('/:id/status', protect, authorize('landlord', 'admin'), updateMaintenanceStatus);
router.post('/:id/notes', protect, addMaintenanceNote);

module.exports = router;
