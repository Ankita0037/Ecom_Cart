const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all products with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { 
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'name',
      order = 'asc'
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .sort(sortObj)
      .select('-__v');

    // Get unique categories for filtering
    const categories = await Product.distinct('category');
    
    res.json({
      products,
      categories,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Add a new product (for testing)
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;