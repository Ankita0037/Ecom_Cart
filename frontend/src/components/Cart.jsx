import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, addToCart, checkout } from '../services/api';

const Cart = ({ isOpen, onClose, onCartChange }) => {
	const [cart, setCart] = useState({ items: [], total: 0 });
	const [loading, setLoading] = useState(false);
	const [checkoutInfo, setCheckoutInfo] = useState({ name: '', email: '' });
	const [receipt, setReceipt] = useState(null);

	useEffect(() => {
		if (isOpen) fetchCart();
	}, [isOpen]);

	const fetchCart = async () => {
		try {
			setLoading(true);
			const data = await getCart();
			setCart(data || { items: [], total: 0 });
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async (productId) => {
		try {
			await removeFromCart(productId);
			await fetchCart();
			onCartChange && onCartChange();
		} catch (err) {
			console.error(err);
		}
	};

	const handleUpdateQty = async (productId, qty) => {
		try {
			if (qty <= 0) {
				await removeFromCart(productId);
			} else {
				// remove then add with new qty (backend uses simple add/remove)
				await removeFromCart(productId);
				await addToCart(productId, qty);
			}
			await fetchCart();
			onCartChange && onCartChange();
		} catch (err) {
			console.error(err);
		}
	};

	const handleCheckout = async (e) => {
		e.preventDefault();
		try {
			const receiptData = await checkout(checkoutInfo);
			setReceipt(receiptData);
			await fetchCart();
			onCartChange && onCartChange();
		} catch (err) {
			console.error(err);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex">
			<div className="flex-1" onClick={onClose} />
			<div className="w-full sm:w-96 bg-white shadow-xl p-4 overflow-auto">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Your Cart</h2>
					<button onClick={onClose} className="text-gray-500">Close</button>
				</div>

				{loading && <p className="mt-4">Loading...</p>}

				{!loading && cart.items.length === 0 && (
					<p className="mt-4 text-gray-600">Your cart is empty</p>
				)}

				<div className="mt-4 space-y-4">
					{cart.items.map((item) => (
						<div key={item.productId._id} className="flex items-center space-x-3">
							<img src={item.productId.image} alt={item.productId.name} className="w-16 h-16 object-cover rounded" />
							<div className="flex-1">
								<div className="font-semibold">{item.productId.name}</div>
								<div className="text-sm text-gray-600">${(item.productId.price || 0).toFixed(2)}</div>
								<div className="mt-2 flex items-center space-x-2">
									<button onClick={() => handleUpdateQty(item.productId._id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
									<span>{item.quantity}</span>
									<button onClick={() => handleUpdateQty(item.productId._id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
									<button onClick={() => handleRemove(item.productId._id)} className="ml-4 text-sm text-red-600">Remove</button>
								</div>
							</div>
							<div className="text-right font-semibold">${((item.productId.price || 0) * item.quantity).toFixed(2)}</div>
						</div>
					))}
				</div>

				<div className="mt-6 border-t pt-4">
					<div className="flex items-center justify-between">
						<div className="text-lg font-semibold">Total</div>
						<div className="text-lg font-bold">${(cart.total || 0).toFixed(2)}</div>
					</div>

					<form onSubmit={handleCheckout} className="mt-4 space-y-2">
						<input
							className="w-full border px-2 py-1 rounded"
							placeholder="Name"
							value={checkoutInfo.name}
							onChange={(e) => setCheckoutInfo({ ...checkoutInfo, name: e.target.value })}
							required
						/>
						<input
							className="w-full border px-2 py-1 rounded"
							placeholder="Email"
							type="email"
							value={checkoutInfo.email}
							onChange={(e) => setCheckoutInfo({ ...checkoutInfo, email: e.target.value })}
							required
						/>
						<button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Checkout</button>
					</form>

					{receipt && (
						<div className="mt-4 p-3 bg-gray-50 rounded">
							<h3 className="font-semibold">Receipt</h3>
							<div className="text-sm text-gray-700">Total: ${receipt.total.toFixed(2)}</div>
							<div className="text-xs text-gray-500">{new Date(receipt.timestamp).toLocaleString()}</div>
							<ul className="mt-2 list-disc pl-5 text-sm">
								{receipt.items.map((it, idx) => (
									<li key={idx}>{it.quantity} x {it.product} — ${it.subtotal.toFixed(2)}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Cart;
