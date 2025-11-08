import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, addToCart } from '../services/api';
import debounce from 'lodash/debounce';

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
      const { products: fetchedProducts, categories: fetchedCategories } = await getProducts(filters);
      setProducts(fetchedProducts || []);
      setCategories(fetchedCategories || []);
    } catch (error) {
      setError('Error loading products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      onCartUpdate();
    } catch (error) {
      setError('Error adding to cart. Please try again.');
      console.error('Error adding to cart:', error);
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
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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
          </div>

          {/* Price Range */}
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
            </select>
            <button
              className="px-3 py-2 border rounded-lg hover:bg-gray-50"
              onClick={() => handleFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc')}
            >
              {filters.order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Products Grid */}
      {!loading ? (
        products && products.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-200 hover:scale-105"
              >
                <div className="relative pb-[100%]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xl font-bold">${product.price.toFixed(2)}</div>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transform transition hover:-translate-y-0.5"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No products found matching your criteria</div>
        )
      ) : null}
    </div>
  );
};

export default ProductGrid;