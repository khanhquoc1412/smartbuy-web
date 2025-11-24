const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// VNPAY IPN (server-to-server callback)
router.get('/vnpay', webhookController.vnpayIPN);

// VNPAY Return URL (user redirect)
router.get('/vnpay/return', webhookController.vnpayReturn);

// MOMO IPN
router.post('/momo', webhookController.momoIPN);

module.exports = router;