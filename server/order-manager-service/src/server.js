require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));

// Routes
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Order Manager Service is running',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    service: 'order-manager',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5003;
connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuy_db_order').then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Order Manager Service running on port ${PORT}`);
  });
});
