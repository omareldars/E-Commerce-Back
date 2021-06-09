const mongoose = require('mongoose');
// Cart Item Schema
const CartItemSchema =  mongoose.Schema({
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Products'
    },
    quantity: Number,
    totalPrice: {
      type: Number
    }
    // ,
    // priceWithTax: {
    //   type: Number,
    //   default: 0
    // }
  });
  
  module.exports = Mongoose.model('CartItem', CartItemSchema);
  
  // Cart Schema
  const CartSchema = new Schema({
    products: [CartItemSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = Mongoose.model('Cart', CartSchema);