import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart, addToCart, checkout } from '../services/api';
import { FiShoppingCart, FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

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
    <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex-1" onClick={onClose} />
      <div className="w-full sm:w-[480px] bg-white shadow-2xl overflow-hidden flex flex-col h-full">
        {/* Cart Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <FiShoppingCart className="text-2xl" />
              <h2 className="text-xl font-bold">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FiShoppingCart className="text-6xl mb-4" />
              <p className="text-xl font-medium">Your cart is empty</p>
              <p className="mt-2">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-sm border"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.productId.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ${(item.productId.price || 0).toFixed(2)} each
                    </p>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQty(item.productId._id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <FiMinus className="text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.productId._id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <FiPlus className="text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId._id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-medium text-gray-900">
                    ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.items.length > 0 && (
          <div className="border-t bg-gray-50 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${(cart.total || 0).toFixed(2)}</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Full Name"
                  value={checkoutInfo.name}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Email Address"
                  type="email"
                  value={checkoutInfo.email}
                  onChange={(e) => setCheckoutInfo({ ...checkoutInfo, email: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </form>

            {receipt && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800">Order Confirmed!</h3>
                <div className="text-sm text-green-700 mt-2">
                  Total Paid: ${receipt.total.toFixed(2)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {new Date(receipt.timestamp).toLocaleString()}
                </div>
                <ul className="mt-3 space-y-1">
                  {receipt.items.map((it, idx) => (
                    <li key={idx} className="text-sm text-green-700">
                      {it.quantity} × {it.product} — ${it.subtotal.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
