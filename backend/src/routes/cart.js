const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Test route to verify cart router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Cart router is working' });
});

// GET /api/cart - Get cart contents
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne().populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ items: [], total: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    console.log('POST /cart - Request body:', req.body);
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId) {
      console.log('Product ID is missing');
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log('Invalid ObjectId format:', productId);
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // Convert productId to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);
    
    // Validate quantity
    if (!quantity || quantity < 1) {
      console.log('Invalid quantity:', quantity);
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Find product first
    console.log('Searching for product:', productObjectId);
    const product = await Product.findOne({ _id: productObjectId });
    
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get or create cart
    // Find or create cart
    console.log('Finding cart...');
    let cart = await Cart.findOne();
    if (!cart) {
      console.log('Creating new cart...');
      cart = new Cart({ items: [], total: 0 });
    }

    // Check if product already in cart
    console.log('Checking for existing item in cart...');
    const existingItem = cart.items.find(item => 
      item.productId.toString() === productObjectId.toString()
    );

    if (existingItem) {
      console.log('Updating existing item quantity from', existingItem.quantity, 'to', existingItem.quantity + quantity);
      existingItem.quantity += quantity;
    } else {
      console.log('Adding new item to cart');
      cart.items.push({ productId: productObjectId, quantity });
    }

    // Recalculate total
    console.log('Calculating new total...');
    cart.total = await calculateTotal(cart.items);
    console.log('New total:', cart.total);
    
    // Save cart
    console.log('Saving cart...');
    await cart.save();
    
    const populatedCart = await cart.populate('items.productId');
    res.json(populatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.productId.toString() !== req.params.id
    );
    
    cart.total = await calculateTotal(cart.items);
    await cart.save();
    
    const populatedCart = await cart.populate('items.productId');
    res.json(populatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/cart/checkout - Process checkout
router.post('/checkout', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Generate receipt
    const receipt = {
      items: cart.items.map(item => ({
        product: item.productId.name,
        quantity: item.quantity,
        price: item.productId.price,
        subtotal: item.quantity * item.productId.price
      })),
      total: cart.total,
      timestamp: new Date(),
    };

    // Clear cart
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json(receipt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to calculate cart total
async function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (product) {
      const itemTotal = product.price * item.quantity;
      console.log(`Item total for ${product.name}: $${itemTotal} (${item.quantity} x $${product.price})`);
      total += itemTotal;
    } else {
      console.log('Warning: Product not found for item:', item.productId);
    }
  }
  console.log('Final total:', total);
  return total;
}

module.exports = router;