const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  processPayment,
  confirmPayment,
  updatePaymentStatus
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('landlord', 'admin'), createPayment);
router.get('/', protect, getAllPayments);
router.get('/:id', protect, getPaymentById);
router.post('/:id/process', protect, authorize('tenant'), processPayment);
router.put('/:id/confirm', protect, authorize('tenant', 'admin'), confirmPayment);
router.put('/:id/status', protect, authorize('admin'), updatePaymentStatus);

module.exports = router;
