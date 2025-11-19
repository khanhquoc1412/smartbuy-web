const cors = require("cors");
const config = require("../config/config");

/**
 * CORS Middleware Configuration
 * Allow requests from client application
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from CLIENT_URL or no origin (for mobile apps, Postman, etc.)
    const allowedOrigins = [
      config.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("⚠️ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, // Cache preflight request for 10 minutes
};

module.exports = cors(corsOptions);
