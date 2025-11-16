import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = Router();

const services = {
  // ===== USER SERVICE (port 3005) - Backend cũ =====
  auth: { url: process.env.USER_SERVICE_URL || 'http://localhost:3005', path: '/api/auth' },
  
  // ===== USER MANAGER SERVICE (port 3006) - Admin quản lý users =====
  users: { url: process.env.USER_MANAGER_SERVICE_URL || 'http://localhost:3006', path: '/api/users' },
  addresses: { url: process.env.USER_MANAGER_SERVICE_URL || 'http://localhost:3006', path: '/api/addresses' },
  
  // ===== PRODUCT SERVICE (port 3001) - Backend cũ =====
  product: { url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001', path: '/api/product' },
  
  // ===== PRODUCT-MANAGER-SERVICE (port 5002) - Microservice mới =====
  // Admin CRUD cho products, categories, brands, colors, memories, specifications
  products: { url: process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002', path: '/api/products' },
  categories: { url: process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002', path: '/api/categories' },
  brands: { url: process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002', path: '/api/brands' },
  colors: { url: process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002', path: '/api/colors' },
  memories: { url: process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002', path: '/api/memories' },
  specifications: { url: process.env.PRODUCT_MANAGER_SERVICE_URL || 'http://localhost:5002', path: '/api/specifications' },
  
  // ===== CART SERVICE (sẽ chuyển sang microservice) =====
  carts: { url: process.env.CART_SERVICE_URL || 'http://localhost:5000', path: '/api/carts' },
  
  // ===== BRAND SERVICE (tạm thời từ monolithic) =====
  brand: { url: process.env.BRAND_SERVICE_URL || 'http://localhost:5000', path: '/api/brand' },
  
  // ===== ORDER MANAGER SERVICE (port 5003) - Microservice quản lý orders =====
  orders: { url: process.env.ORDER_MANAGER_SERVICE_URL || 'http://localhost:5003', path: '/api/orders' },
  
  // ===== MICROSERVICES KHÁC =====
  // location: { url: process.env.LOCATION_SERVICE_URL || 'http://localhost:5004', path: '/api/locations' },
  // promotion: { url: process.env.PROMOTION_SERVICE_URL || 'http://localhost:5005', path: '/api/promotions' },
  // review: { url: process.env.REVIEW_SERVICE_URL || 'http://localhost:5006', path: '/api/reviews' },
  // search: { url: process.env.SEARCH_SERVICE_URL || 'http://localhost:5007', path: '/api/search' },
  // chatbot: { url: process.env.CHATBOT_SERVICE_URL || 'http://localhost:5008', path: '/api/chatbot' }
} as const;

Object.values(services).forEach(service => {
  const proxyOptions = {
    target: service.url,
    changeOrigin: true,
    pathRewrite: { [`^${service.path}`]: service.path },
    timeout: 60000, // ✅ Tăng timeout lên 60s
    proxyTimeout: 60000,
    logLevel: 'debug' as const,
    onProxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[PROXY REQ] ${req.method} ${req.url} -> ${service.url}${req.url}`);
      // ✅ Fix: Đảm bảo Content-Length được set đúng khi proxy
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(`[PROXY RES] ${req.method} ${req.url} <- ${proxyRes.statusCode}`);
    },
    onError: (err: any, req: any, res: any) => {
      console.error(`[PROXY ERROR] ${req.method} ${req.url} ->`, err.message);
      if (!res.headersSent) {
        res.status(503).json({ success: false, message: 'Service unavailable' });
      }
    }
  };
  router.use(service.path, createProxyMiddleware(proxyOptions));
});

export default router;


