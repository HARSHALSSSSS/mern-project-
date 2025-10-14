const express = require('express');
const router = express.Router();
const {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  terminateContract
} = require('../controllers/contractController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('landlord', 'admin'), createContract);
router.get('/', protect, getAllContracts);
router.get('/:id', protect, getContractById);
router.put('/:id', protect, authorize('landlord', 'admin'), updateContract);
router.put('/:id/terminate', protect, authorize('landlord', 'admin'), terminateContract);

module.exports = router;
