const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(adminAuth);

// Get all addresses of a user
router.get('/user/:userId', addressController.getUserAddresses);

// Create new address
router.post('/', addressController.createAddress);

// Bulk delete addresses
router.delete('/', addressController.bulkDeleteAddresses);

// Get address by ID
router.get('/:id', addressController.getAddressById);

// Update address
router.put('/:id', addressController.updateAddress);

// Set address as default
router.patch('/:id/set-default', addressController.setDefaultAddress);

// Delete address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
