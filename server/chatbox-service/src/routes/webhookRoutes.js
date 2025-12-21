const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const { validateWebhookRequest } = require('../middleware/validation');

/**
 * POST /webhook/dialogflow
 * Main webhook endpoint for Dialogflow
 * This is the URL you'll configure in Dialogflow Console
 */
router.post('/dialogflow', validateWebhookRequest, webhookController.handleDialogflowWebhook);

/**
 * POST /webhook/test
 * Test webhook endpoint for development
 */
router.post('/test', (req, res) => {
  console.log('📨 Test Webhook Request:', JSON.stringify(req.body, null, 2));

  res.json({
    success: true,
    message: 'Test webhook received',
    receivedData: req.body
  });
});

/**
 * GET /webhook/info
 * Get webhook configuration info
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    webhook: {
      url: process.env.WEBHOOK_URL || 'Not configured',
      environment: process.env.NODE_ENV,
      dialogflowProjectId: process.env.GOOGLE_PROJECT_ID,
      supportedIntents: [
        'product.search',
        'product.search.by-brand',
        'product.search.by-price',
        'product.detail',
        'order.track',
        'order.cancel',
        'promotion.check',
        'price.compare'
      ]
    }
  });
});

module.exports = router;
