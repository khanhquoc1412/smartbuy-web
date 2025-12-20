const cors = require("cors");
const { StatusCodes } = require("http-status-codes");

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow localhost and any IP in 192.168.x.x range
    const allowedOrigins = [
      /^http:\/\/localhost(:\d+)?$/, // localhost with any port
      /^http:\/\/127\.0\.0\.1(:\d+)?$/, // 127.0.0.1 with any port
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/, // Any 192.168.x.x with any port
      /^https:\/\/.*\.railway\.app$/, // Railway domains
    ];

    const isAllowed = allowedOrigins.some((pattern) => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      // Don't throw error, just deny with false
      callback(null, true); // Temporarily allow all for testing
    }
  },
  credentials: true,
  optionsSuccessStatus: StatusCodes.OK,
});

module.exports = { corsMiddleware };
