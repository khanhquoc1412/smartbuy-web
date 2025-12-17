require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/database');

const app = express();

// Tạo thư mục uploads nếu chưa có
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'product-manager' });
});

app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/colors', require('./routes/colors'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/specifications', require('./routes/specifications'));
app.get('/', (req, res) => res.json({ success: true, message: 'Product Service OK' }));

const PORT = process.env.PORT || 5002;
connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuy_db_product').then(() => {
  app.listen(PORT, () => console.log(`🚀 product-service listening on ${PORT}`));
});


