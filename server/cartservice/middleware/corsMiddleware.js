const cors = require("cors");

/**
 * CORS Middleware Configuration
 * Microservice behind API Gateway - allow all internal requests
 */
const corsOptions = {
  origin: true, // Allow all origins since API Gateway handles CORS
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600,
};

module.exports = cors(corsOptions);
