const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
});

// GET /api/products - Get all products for user
router.get('/', auth, async (req, res) => {
  try {
    const { published, search } = req.query;
    const query = { owner: req.user._id };

    if (published === 'true') query.isPublished = true;
    if (published === 'false') query.isPublished = false;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/products - Create product
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { name, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligible } = req.body;

    if (!name) return res.status(400).json({ message: 'Please enter product name' });
    if (!productType) return res.status(400).json({ message: 'Product type is required' });
    if (!quantityStock) return res.status(400).json({ message: 'Quantity stock is required' });
    if (!mrp) return res.status(400).json({ message: 'MRP is required' });
    if (!sellingPrice) return res.status(400).json({ message: 'Selling price is required' });

    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      name,
      productType,
      quantityStock: Number(quantityStock),
      mrp: Number(mrp),
      sellingPrice: Number(sellingPrice),
      brandName,
      images,
      exchangeEligible: exchangeEligible === 'true' || exchangeEligible === true,
      owner: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligible, keepImages } = req.body;

    if (name) product.name = name;
    if (productType) product.productType = productType;
    if (quantityStock !== undefined) product.quantityStock = Number(quantityStock);
    if (mrp !== undefined) product.mrp = Number(mrp);
    if (sellingPrice !== undefined) product.sellingPrice = Number(sellingPrice);
    if (brandName !== undefined) product.brandName = brandName;
    if (exchangeEligible !== undefined) product.exchangeEligible = exchangeEligible === 'true';

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      const existing = keepImages ? JSON.parse(keepImages) : [];
      product.images = [...existing, ...newImages];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id/publish - Toggle publish
router.put('/:id/publish', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isPublished = !product.isPublished;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
