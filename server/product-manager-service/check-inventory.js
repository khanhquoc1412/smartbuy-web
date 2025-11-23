const mongoose = require('mongoose');
require('dotenv').config();

const ProductVariant = require('./src/models/product_variant');

async function checkInventory() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartbuy_db_product');
    console.log('Connected to MongoDB');
    
    const all = await ProductVariant.countDocuments();
    const low = await ProductVariant.countDocuments({ stock: { $lt: 10 } });
    const normal = await ProductVariant.countDocuments({ stock: { $gte: 10, $lt: 50 } });
    const high = await ProductVariant.countDocuments({ stock: { $gte: 50 } });
    
    console.log('\n=== INVENTORY CHECK ===');
    console.log('Total variants:', all);
    console.log('Low stock (< 10):', low);
    console.log('Normal stock (10-49):', normal);
    console.log('High stock (>= 50):', high);
    console.log('Sum check:', low + normal + high, '==', all, '?', (low + normal + high === all ? '✓' : '✗'));
    
    const samples = await ProductVariant.find({ stock: { $gte: 50 } }).limit(10).select('stock productId');
    console.log('\n=== HIGH STOCK SAMPLES (>= 50) ===');
    samples.forEach((v, i) => {
      console.log(`${i + 1}. Stock: ${v.stock}, Variant ID: ${v._id}`);
    });
    
    const stats = await ProductVariant.aggregate([
      {
        $group: {
          _id: null,
          minStock: { $min: '$stock' },
          maxStock: { $max: '$stock' },
          avgStock: { $avg: '$stock' }
        }
      }
    ]);
    
    console.log('\n=== STOCK RANGE ===');
    console.log('Min:', stats[0].minStock);
    console.log('Max:', stats[0].maxStock);
    console.log('Avg:', Math.round(stats[0].avgStock));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkInventory();
