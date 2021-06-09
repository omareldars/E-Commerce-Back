const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  photo: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: Date,
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number
  }
  ,
  isActive: {
    type: Boolean,
    default: true
  },
});

module.exports = mongoose.model('Product', ProductSchema);
