const Product = require('./models/Product');
const sampleProducts = require('./data/sampleProducts');

async function seedIfEmpty() {
  try {
    // Count existing products
    const count = await Product.countDocuments();
    console.log('Existing products:', count);
    
    // Always clear and reseed
    console.log('Clearing all products...');
    await Product.deleteMany({});
    
    // Insert our sample products
    console.log('Inserting new products...');
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${inserted.length} products`);
    
    // Verify each product
    for (const product of inserted) {
      console.log(`Verified: ${product._id} - ${product.name}`);
    }
    
  } catch (err) {
    console.error('Seed error:', err);
  }
}

module.exports = { seedIfEmpty };
