const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(adminAuth);

// Get user statistics
router.get('/stats', userController.getUserStats);

// Get all users with filters
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Delete multiple users
router.delete('/', userController.deleteUsers);

// Toggle block status
router.patch('/:id/toggle-block', userController.toggleBlockStatus);

// Toggle admin role
router.patch('/:id/toggle-admin', userController.toggleAdminRole);

module.exports = router;
