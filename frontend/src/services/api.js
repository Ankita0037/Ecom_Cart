import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add request interceptor to handle errors
axios.interceptors.request.use(config => {
  console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
  return config;
});

// Add response interceptor for better error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the backend server running?');
    }
    return Promise.reject(error);
  }
);

export async function getProducts(params = {}) {
	const res = await axios.get(`${BASE}/products`, { params });
	return res.data;
}

export async function getCart() {
	const res = await axios.get(`${BASE}/cart`);
	return res.data;
}

export async function addToCart(productId, quantity = 1) {
  try {
    console.log('Sending add to cart request:', { productId, quantity, url: `${BASE}/cart` });
    const res = await axios.post(`${BASE}/cart`, { productId, quantity });
    console.log('Add to cart response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Add to cart error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    const message = error.response?.data?.message || 'Error adding item to cart';
    throw new Error(message);
  }
}

export async function removeFromCart(productId) {
	const res = await axios.delete(`${BASE}/cart/${productId}`);
	return res.data;
}

export async function checkout(customer = {}) {
	// backend clears cart and returns receipt
	const res = await axios.post(`${BASE}/cart/checkout`, { customer });
	return res.data;
}

export default {
	getProducts,
	getCart,
	addToCart,
	removeFromCart,
	checkout,
};
