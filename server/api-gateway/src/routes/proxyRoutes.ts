import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = Router();

const services = {
  user: { url: process.env.USER_SERVICE_URL || 'http://localhost:5001', path: '/api/users' },
  product: { url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002', path: '/api/products' },
  category: { url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002', path: '/api/categories' },
  brand: { url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002', path: '/api/brands' },
  color: { url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002', path: '/api/colors' },
  order: { url: process.env.ORDER_SERVICE_URL || 'http://localhost:5003', path: '/api/orders' },
  location: { url: process.env.LOCATION_SERVICE_URL || 'http://localhost:5004', path: '/api/locations' },
  promotion: { url: process.env.PROMOTION_SERVICE_URL || 'http://localhost:5005', path: '/api/promotions' },
  review: { url: process.env.REVIEW_SERVICE_URL || 'http://localhost:5006', path: '/api/reviews' },
  search: { url: process.env.SEARCH_SERVICE_URL || 'http://localhost:5007', path: '/api/search' },
  chatbot: { url: process.env.CHATBOT_SERVICE_URL || 'http://localhost:5008', path: '/api/chatbot' }
} as const;

Object.values(services).forEach(service => {
  const proxyOptions = {
    target: service.url,
    changeOrigin: true,
    pathRewrite: { [`^${service.path}`]: service.path },
    onError: (_: any, __: any, res: any) => {
      res.status(503).json({ success: false, message: 'Service unavailable' });
    }
  };
  router.use(service.path, createProxyMiddleware(proxyOptions));
});

export default router;


