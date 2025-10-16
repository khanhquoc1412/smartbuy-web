const mongoose = require('mongoose');
require('dotenv').config();

async function checkCollections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/products_phone_shop');
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📋 Collections in database:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check ProductVariant collection
    const ProductVariant = require('../src/models/product_variant');
    const variantCount = await ProductVariant.countDocuments();
    console.log(`\n📊 ProductVariant count: ${variantCount}`);
    
    if (variantCount > 0) {
      const variants = await ProductVariant.find().limit(3);
      console.log('\n🔍 Sample ProductVariants:');
      variants.forEach(v => {
        console.log(`  - Product: ${v.productId}, Stock: ${v.stock}, Price: ${v.price}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Done');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCollections();
