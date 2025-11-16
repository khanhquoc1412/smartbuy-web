const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const statsController = require('../controllers/statsController');

// GET /api/orders - Get all orders with filters and pagination
router.get('/', orderController.getAllOrders);

// ============ STATS ENDPOINTS ============
// GET /api/orders/stats/overview - Overview: revenue, orders, customers, AOV
router.get('/stats/overview', statsController.getOverview);

// GET /api/orders/stats/revenue-timeline - Revenue timeline (daily/weekly/monthly)
router.get('/stats/revenue-timeline', statsController.getRevenueTimeline);

// GET /api/orders/stats/by-status - Orders grouped by status
router.get('/stats/by-status', statsController.getOrdersByStatus);

// GET /api/orders/stats/peak-hours - Peak hours analysis
router.get('/stats/peak-hours', statsController.getPeakHours);

// GET /api/orders/stats/payment-methods - Payment methods distribution
router.get('/stats/payment-methods', statsController.getPaymentMethods);

// GET /api/orders/stats - Get order statistics (old endpoint)
router.get('/stats', orderController.getOrderStats);

// GET /api/orders/:id - Get order detail by ID
router.get('/:id', orderController.getOrderById);

// POST /api/orders - Create new order
router.post('/', orderController.createOrder);

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// POST /api/orders/:id/cancel - Cancel order with validation and refund
router.post('/:id/cancel', orderController.cancelOrder);

// PATCH /api/orders/:id - Update order
router.patch('/:id', orderController.updateOrder);

// DELETE /api/orders - Bulk delete orders
router.delete('/', orderController.bulkDeleteOrders);

// DELETE /api/orders/:id - Delete single order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
