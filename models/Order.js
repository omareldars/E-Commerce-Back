const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    cart: [],
    totalPrice:{
        type: Number,
        default: 0,
        required: true
    },
    status: {
      type: String,
      default: 'Not processed',
      enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
       
    shippingAddress: {
        type: String,
    },

    city: {
        type: String,
    },

    country: {
        type: String,
        required: true
    },

    phone:{
        type: String,
        required: true
    },
    tax:{
        type:Number,
    },
    subtotal:{
        type:Number
    }

},{
    timestamps: {createdAt: 'created_at', updatedAt: false}});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;