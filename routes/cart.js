const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middlewares/auth');
const Product = require('../models/Products');

router.post('/add', auth, (req, res) => {
  // console.log('Order Request', req);
  //   const user = req.user.id;

    const products = req.body.products;

  // const { body ,} = req;
  // lets give it a try at first
  const {body, user: { id },} = req;
  const cart = new Cart({...body, user: id,});
  console.log("body---->",body);
  console.log("req.body--->",req.body.products);
  console.log("cart--->",cart);
  cart.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.',
      });
    }
    decreaseQuantity(products);
    res.status(200).json({
      success: true,
      cartId: data.id,
    });
  });
});

router.delete('/delete/:cartId', auth, (req, res) => {
  Cart.deleteOne({ _id: req.params.cartId }, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.',
      });
    }
    res.status(200).json({
      success: true,
    });
  });
});


router.post('/add/:cartId', auth, (req, res) => {
  console.log("from add to cart req--->",req);
  const product = req.body.product;
  const query = { _id: req.params.cartId };

  Cart.updateOne(query, { $push: { products: product } }).exec(err => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
    res.status(200).json({
      success: true
    });
  });
});

router.delete('/delete/:cartId/:productId', auth, (req, res) => {
  const product = { product: req.params.productId };
  const query = { _id: req.params.cartId };

  Cart.updateOne(query, { $pull: { products: product } }).exec(err => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
    res.status(200).json({
      success: true
    });
  });
});

const decreaseQuantity = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity } }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};




module.exports = router;
