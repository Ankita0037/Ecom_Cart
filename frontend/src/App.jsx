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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Discover Our Products
          </h1>
          <ProductGrid onCartUpdate={refreshCartCount} />
        </div>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} onCartChange={refreshCartCount} />
    </div>
  );
}

export default App;
