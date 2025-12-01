const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const config = require('./config/config');

const app = express();

// ============ MIDDLEWARE ============
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ ROUTES ============
// Chỉ giữ order routes cho User
app.use('/api/order', require('./routes/order.routes'));

// XÓA: app.use('/api/stats', require('./routes/stats.routes'));

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'OrderService (User) is running',
    port: config.PORT,
    service: 'user-order-service',
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ============ START SERVER ============
const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`✅ OrderService (User) running on port ${config.PORT}`);
      console.log(`🌐 Environment: ${config.NODE_ENV}`);
      console.log(`📦 Database: ${config.MONGO_URI}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;// restart
// restart2
// restart3
// restart4
