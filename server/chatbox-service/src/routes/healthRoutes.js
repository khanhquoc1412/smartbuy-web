const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  const healthStatus = {
    success: true,
    service: 'chatbox-service',
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      usage: process.memoryUsage(),
      percentUsed: ((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100).toFixed(2) + '%'
    },
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  };

  res.json(healthStatus);
});

/**
 * GET /health/ready
 * Readiness check for Kubernetes/Docker
 */
router.get('/ready', (req, res) => {
  // Check if all required services are accessible
  const isReady = true; // Add your readiness checks here

  if (isReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

/**
 * GET /health/live
 * Liveness check for Kubernetes/Docker
 */
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
