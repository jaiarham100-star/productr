const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  productType: {
    type: String,
    enum: ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others'],
    required: [true, 'Product type is required'],
  },
  quantityStock: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0,
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: 0,
  },
  brandName: {
    type: String,
    trim: true,
  },
  images: [{
    type: String,
  }],
  exchangeEligible: {
    type: Boolean,
    default: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
