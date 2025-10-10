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
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API Gateway is running', timestamp: new Date().toISOString(), service: 'api-gateway', version: '1.0.0', port: PORT });
});

app.get('/api/info', (_req, res) => {
  res.json({
    success: true,
    message: 'Mobile Shop API Gateway',
    version: '1.0.0',
    services: {
      user: process.env.USER_SERVICE_URL || 'http://localhost:5001',
      product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
      order: process.env.ORDER_SERVICE_URL || 'http://localhost:5003',
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


