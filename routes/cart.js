const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middlewares/auth');
const Product = require('../models/Products');

router.post('/add', auth, (req, res) => {
  console.log('Order Request', req);
  //   const user = req.user.id;

  //   const products = req.body.products;

  // const { body ,} = req;
  //

  const {
    body,
    user: { id },
  } = req;
  const cart = new Cart({
    ...body,
    user: id,
  });

  cart.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.',
      });
    }

    decreaseQuantity(body);

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

const decreaseQuantity = (body) => {
  let bulkOptions = body.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity } },
      },
    };
  });

  Product.bulkWrite(bulkOptions);
};

module.exports = router;
