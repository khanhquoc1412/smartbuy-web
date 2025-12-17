const jwt = require('jsonwebtoken');

/**
 * Middleware to verify admin JWT token
 */
const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    // Use ACCESS_TOKEN_PRIVATE_KEY to match user-service token generation
    const secret = process.env.ACCESS_TOKEN_PRIVATE_KEY || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = adminAuth;
