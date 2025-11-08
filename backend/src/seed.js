const Product = require('./models/Product');
const { getFakeStoreProducts } = require('./utils/fakeStoreApi');

// Fallback sample products in case API fails
const sampleProducts = [
  {
    name: 'Acoustic Guitar',
    price: 199.99,
    description: 'Full-size acoustic guitar for beginners and pros.',
    image: 'https://picsum.photos/seed/guitar/600/400',
    category: 'music'
  },
  {
    name: 'Wireless Headphones',
    price: 89.99,
    description: 'Noise-cancelling over-ear headphones.',
    image: 'https://picsum.photos/seed/headphones/600/400',
    category: 'electronics'
  },
  {
    name: 'Coffee Mug',
    price: 12.5,
    description: 'Stylish ceramic mug for your morning coffee.',
    image: 'https://picsum.photos/seed/mug/600/400',
    category: 'home'
  },
  {
    name: 'Sneakers',
    price: 79.0,
    description: 'Comfortable everyday sneakers.',
    image: 'https://picsum.photos/seed/sneakers/600/400',
    category: 'clothing'
  },
  {
    name: 'Notebook',
    price: 6.99,
    description: 'Hardcover notebook for notes and sketches.',
    image: 'https://picsum.photos/seed/notebook/600/400',
    category: 'stationery'
  }
];

async function seedIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      // Try to get products from Fake Store API
      const fakeStoreProducts = await getFakeStoreProducts();
      
      // Use Fake Store products if available, otherwise use sample products
      const productsToSeed = fakeStoreProducts || sampleProducts;
      
      await Product.insertMany(productsToSeed);
      console.log('Inserted products:', productsToSeed.length);
    } else {
      console.log('Products collection not empty, skipping seed');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

module.exports = { seedIfEmpty };
