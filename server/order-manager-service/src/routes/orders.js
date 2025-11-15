const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders - Get all orders with filters and pagination
router.get('/', orderController.getAllOrders);

// GET /api/orders/stats - Get order statistics
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
