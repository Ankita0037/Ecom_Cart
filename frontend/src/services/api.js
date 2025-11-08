import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function getProducts(params = {}) {
	const res = await axios.get(`${BASE}/products`, { params });
	return res.data;
}

export async function getCart() {
	const res = await axios.get(`${BASE}/cart`);
	return res.data;
}

export async function addToCart(productId, quantity = 1) {
	const res = await axios.post(`${BASE}/cart`, { productId, quantity });
	return res.data;
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
