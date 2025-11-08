const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Acoustic Guitar',
    price: 199.99,
    description: 'Full-size acoustic guitar for beginners and pros.',
    image: 'https://picsum.photos/seed/guitar/600/400'
  },
  {
    name: 'Wireless Headphones',
    price: 89.99,
    description: 'Noise-cancelling over-ear headphones.',
    image: 'https://picsum.photos/seed/headphones/600/400'
  },
  {
    name: 'Coffee Mug',
    price: 12.5,
    description: 'Stylish ceramic mug for your morning coffee.',
    image: 'https://picsum.photos/seed/mug/600/400'
  },
  {
    name: 'Sneakers',
    price: 79.0,
    description: 'Comfortable everyday sneakers.',
    image: 'https://picsum.photos/seed/sneakers/600/400'
  },
  {
    name: 'Notebook',
    price: 6.99,
    description: 'Hardcover notebook for notes and sketches.',
    image: 'https://picsum.photos/seed/notebook/600/400'
  }
];

async function seedIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Inserted sample products');
    } else {
      console.log('Products collection not empty, skipping seed');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

module.exports = { seedIfEmpty };
