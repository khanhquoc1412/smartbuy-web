const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const statsController = require('../controllers/statsController');
const adminAuth = require('../middleware/adminAuth');

// Internal API (no auth required) - for other services
router.get('/internal/:id', userController.getUserById);

// ============ STATS ENDPOINTS (NO AUTH - for frontend stats page) ============
// GET /api/users/stats/overview - User overview statistics
router.get('/stats/overview', statsController.getUsersOverview);

// GET /api/users/stats/segments - Customer segments (VIP, Frequent, New)
router.get('/stats/segments', statsController.getCustomerSegments);

// GET /api/users/stats/top-customers - Top VIP customers
router.get('/stats/top-customers', statsController.getTopCustomers);

// GET /api/users/stats/activity - User activity timeline
router.get('/stats/activity', statsController.getUserActivity);

// Apply admin authentication to all other routes
router.use(adminAuth);

// Get user statistics (old endpoint)
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
