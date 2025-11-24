/**
 * Validate Dialogflow webhook request
 */
exports.validateWebhookRequest = (req, res, next) => {
  try {
    const { queryResult, session } = req.body;

    // Check if request has required Dialogflow fields
    if (!queryResult || !session) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Dialogflow request format'
      });
    }

    // Validate webhook secret if configured (DISABLED for development)
    // const webhookSecret = process.env.WEBHOOK_SECRET;
    // if (webhookSecret) {
    //   const providedSecret = req.headers['x-webhook-secret'];
    //   if (providedSecret !== webhookSecret) {
    //     console.warn('⚠️ Invalid webhook secret');
    //     return res.status(401).json({
    //       success: false,
    //       message: 'Unauthorized'
    //     });
    //   }
    // }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(400).json({
      success: false,
      message: 'Request validation failed'
    });
  }
};

/**
 * Rate limiting middleware
 */
exports.rateLimiter = () => {
  const requestCounts = new Map();
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000; // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

  return (req, res, next) => {
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    
    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const userData = requestCounts.get(identifier);
    
    if (now > userData.resetTime) {
      // Reset window
      requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((userData.resetTime - now) / 1000)
      });
    }

    userData.count++;
    next();
  };
};
