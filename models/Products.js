const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category:{
    type: Schema.Types.ObjectId,
    ref: 'Categories',
    default: null
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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
}
});

module.exports = mongoose.model('Product', ProductSchema);
