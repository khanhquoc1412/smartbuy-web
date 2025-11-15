const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminAuth = require('../middleware/adminAuth');

// Internal API (no auth required) - for other services
router.get('/internal/:id', userController.getUserById);

// Apply admin authentication to all other routes
router.use(adminAuth);

// Get user statistics
router.get('/stats', userController.getUserStats);

// Get all users with filters
router.get('/', userController.getAllUsers);

// Create new user
router.post('/', userController.createUser);

// Bulk operations
router.patch('/bulk-block', userController.bulkBlockUsers);
router.patch('/bulk-admin', userController.bulkSetAdmin);

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
