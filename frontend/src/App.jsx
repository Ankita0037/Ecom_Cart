import React from 'react';
import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import { getCart } from './services/api';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    refreshCartCount();
  }, []);

  const refreshCartCount = async () => {
    try {
      const cart = await getCart();
      const count = (cart && cart.items) ? cart.items.reduce((s, it) => s + (it.quantity || 0), 0) : 0;
      setCartCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <ProductGrid onCartUpdate={refreshCartCount} />
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} onCartChange={refreshCartCount} />
    </div>
  );
}

export default App;
