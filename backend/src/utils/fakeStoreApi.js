const fetch = require('node-fetch');

async function getFakeStoreProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    
    // Transform to match our schema
    return products.map(product => ({
      name: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category
    }));
  } catch (error) {
    console.error('Error fetching from Fake Store API:', error);
    return null;
  }
}

module.exports = { getFakeStoreProducts };