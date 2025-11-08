import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ cartCount, onOpenCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white text-gray-900 shadow-md' 
          : 'bg-transparent text-white'
      }`}
    >
      <div className="relative">
        {/* Background Gradient when not scrolled */}
        {!isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent -z-10" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className={`text-xl font-bold ${
                isScrolled 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
                  : 'text-white'
              }`}>
                Vibe Commerce
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                <a 
                  href="#" 
                  className={`text-sm font-medium transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Home
                </a>
                <a 
                  href="#" 
                  className={`text-sm font-medium transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Products
                </a>
                <a 
                  href="#" 
                  className={`text-sm font-medium transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Categories
                </a>
                <a 
                  href="#" 
                  className={`text-sm font-medium transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  About
                </a>
              </nav>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
                  isScrolled
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white'
                }`}
              >
                <FiShoppingCart className="text-lg" />
                <span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center space-x-4">
              <button
                onClick={onOpenCart}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled
                    ? 'hover:bg-gray-100'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="sm:hidden bg-white border-t">
              <nav className="flex flex-col py-4">
                <a href="#" className="px-4 py-2 text-gray-600 hover:bg-gray-50">Home</a>
                <a href="#" className="px-4 py-2 text-gray-600 hover:bg-gray-50">Products</a>
                <a href="#" className="px-4 py-2 text-gray-600 hover:bg-gray-50">Categories</a>
                <a href="#" className="px-4 py-2 text-gray-600 hover:bg-gray-50">About</a>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
