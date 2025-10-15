const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  updatePropertyApproval
} = require('../controllers/propertyController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', optionalAuth, getAllProperties);  // Optional auth - public can see approved, admin can see all
router.get('/landlord/my-properties', protect, authorize('landlord', 'admin'), getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('landlord', 'admin'), upload.array('images', 10), createProperty);
router.put('/:id', protect, authorize('landlord', 'admin'), upload.array('images', 10), updateProperty);
router.delete('/:id', protect, authorize('landlord', 'admin'), deleteProperty);
router.put('/:id/approval', protect, authorize('admin'), updatePropertyApproval);

module.exports = router;
