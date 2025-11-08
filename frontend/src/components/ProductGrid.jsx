import React, { useState, useEffect } from 'react';
import { getProducts, addToCart } from '../services/api';
import { Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const ProductGrid = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      onCartUpdate();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <div className="mt-4 flex-1">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xl font-bold">${(product.price || 0).toFixed(2)}</div>
            <button
              onClick={() => handleAddToCart(product._id)}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;