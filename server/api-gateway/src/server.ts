import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import proxyRoutes from './routes/proxyRoutes';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 10000, max: 10000 }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('combined'));

// ⚠️ Chỉ parse JSON/urlencoded cho NON-multipart requests
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    express.json({ limit: '10mb' })(req, res, next);
  } else {
    next();
  }
});
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
  } else {
    next();
  }
});

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Gateway is running', timestamp: new Date().toISOString(), service: 'api-gateway', version: '1.0.0', port: PORT });
});

app.get('/api/info', (_req, res) => {
  res.json({
    success: true,
    message: 'Smartbuy API Gateway',
    version: '1.0.0',
    services: {
      user: process.env.USER_SERVICE_URL || 'http://localhost:3005',
      product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
      productManager: process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002',
      cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
      order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
      payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3002',
      brand: process.env.BRAND_SERVICE_URL || 'http://localhost:5000',
      orderManager: process.env.ORDER_MANAGER_SERVICE_URL || 'http://localhost:5003',
      location: process.env.LOCATION_SERVICE_URL || 'http://localhost:5004',
      promotion: process.env.PROMOTION_SERVICE_URL || 'http://localhost:5005',
      review: process.env.REVIEW_SERVICE_URL || 'http://localhost:5006',
      search: process.env.SEARCH_SERVICE_URL || 'http://localhost:5007',
      chatbot: process.env.CHATBOT_SERVICE_URL || 'http://localhost:5008'
    }
  });
});

app.use('/', proxyRoutes);

app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway (TS) running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});


