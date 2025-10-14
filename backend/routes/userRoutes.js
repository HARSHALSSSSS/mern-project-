const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserStatus,
  deleteUser,
  uploadAvatar
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
