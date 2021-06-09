const mongoose = require('mongoose');

// Category Schema
const CategorySchema =  mongoose.Schema({
    _id: {
      type: Schema.ObjectId,
      auto: true
    },
    name: {
      type: String,
      trim: true
    
    },
    image: {
        type: String, required: true
    },
    description: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Products'
      }
    ],
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = Mongoose.model('Category', CategorySchema);