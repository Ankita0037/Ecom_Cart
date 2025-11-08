const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

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
    const { productId, quantity } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ items: [], total: 0 });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Recalculate total
    cart.total = await calculateTotal(cart.items);
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
      total += product.price * item.quantity;
    }
  }
  return total;
}

module.exports = router;