import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, addToCart } from '../services/api';
import debounce from 'lodash/debounce';
import { FiSearch, FiShoppingCart, FiFilter, FiChevronUp, FiChevronDown, FiStar } from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';
import { MdCategory } from 'react-icons/md';
import sampleProducts from '../data/sampleProducts';

// Helper function to get appropriate product image
const getProductImage = (name, category) => {
  // Handle undefined or null values
  const safeName = name || '';
  const safeCategory = category || '';
  
  // Clean up the name and category for the URL
  const cleanName = safeName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanCategory = safeCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Try to match product name with a curated image
  const productImages = {
    // Electronics
    'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    'camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    
    // Clothing
    'tshirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    
    // Jewelry
    'watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
    'necklace': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
    
    // Default category-based images
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    'clothing': 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    'jewelry': 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407'
  };
  
  // First try to match by product name
  for (const [key, url] of Object.entries(productImages)) {
    if (cleanName.includes(key)) {
      return url;
    }
  }
  
  // If no name match, try category match
  if (productImages[cleanCategory]) {
    return productImages[cleanCategory];
  }
  
  // Fallback to dynamic Unsplash image
  return `https://source.unsplash.com/400x400/?${category},${name}`;
};

const ProductGrid = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: 'name',
    order: 'asc'
  });

  // Debounced fetch function for search and price filters
  const debouncedFetch = useCallback(
    debounce((filters) => {
      fetchProducts(filters);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedFetch(filters);
  }, [filters, debouncedFetch]);

  const fetchProducts = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use sample products instead of API call
      const allProducts = sampleProducts;
      
      // Filter products based on criteria
      let filteredProducts = [...allProducts];
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === filters.category
        );
      }
      
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= parseFloat(filters.minPrice)
        );
      }
      
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(product => 
          product.price <= parseFloat(filters.maxPrice)
        );
      }
      
      // Sort products
      filteredProducts.sort((a, b) => {
        const order = filters.order === 'asc' ? 1 : -1;
        switch (filters.sort) {
          case 'price':
            return (a.price - b.price) * order;
          case 'category':
            return a.category.localeCompare(b.category) * order;
          default: // name
            return a.name.localeCompare(b.name) * order;
        }
      });

      // Extract unique categories
      const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
      
      setProducts(filteredProducts);
      setCategories(uniqueCategories);
    } catch (error) {
      setError('Error loading products. Please try again.');
      console.error('Error processing products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = async (productId) => {
    try {
      if (!productId) {
        console.error('Invalid product ID:', productId);
        setError('Invalid product ID');
        return;
      }
      
      // Validate productId format
      if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
        console.error('Invalid MongoDB ObjectId format:', productId);
        setError('Invalid product ID format');
        return;
      }
      
      console.log('Adding to cart:', productId); // Debug log
      await addToCart(productId, 1);
      onCartUpdate && onCartUpdate();
      
      // Show success message
      setError(null);
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Added to cart successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Error adding to cart. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <MdCategory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <select
              className="w-full pl-9 pr-8 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.filter(Boolean).map(category => (
                <option key={category} value={category}>
                  {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          </div>

          {/* Price Range */}
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="number"
                placeholder="Min Price"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Max Price"
                className="w-full pl-3 pr-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <BiSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <select
                className="w-full pl-9 pr-8 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all duration-200"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="category">Category</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            </div>
            <button
              className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
              onClick={() => handleFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc')}
            >
              {filters.order === 'asc' ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute top-0"></div>
          </div>
          <div className="text-lg text-gray-500 mt-4">Loading products...</div>
        </div>
      )}

      {/* Products Grid */}
      {!loading ? (
        products && products.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="relative pb-[100%] bg-gray-100">
                  <img
                    src={getProductImage(product.name, product.category)}
                    alt={product.name || 'Product image'}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://source.unsplash.com/400x400/?product`;
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-indigo-800 text-sm font-medium rounded-full shadow-lg">
                      {product.category ? 
                        (product.category.charAt(0).toUpperCase() + product.category.slice(1)) 
                        : 'Uncategorized'}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem]">
                    {product.name || 'Unnamed Product'}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 min-h-[3rem]">
                    {product.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Price</p>
                      <div className="text-2xl font-bold text-indigo-600">
                        ${(typeof product.price === 'number' ? product.price.toFixed(2) : '0.00')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transform transition-all duration-200 hover:shadow-md"
                    >
                      <FiShoppingCart className="text-lg" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="text-gray-400 text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )
      ) : null}
    </div>
  );
};

export default ProductGrid;