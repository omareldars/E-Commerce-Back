const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const CategorySchema =  new Schema({
    _id: {
      type: Schema.ObjectId,
      auto: true
    },
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = Mongoose.model('Category', CategorySchema);
