const express = require('express');
const router = express.Router();

const Wishlist = require('../models/wishlist');
const Products = require('../models/Products');

const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { product, isLiked } = req.body;
    const user = req.user;
    const update = {
      product,
      isLiked,
      updated: Date.now(),
    };
    const query = { product: update.product, user: user._id };

    const updatedWishlist = await Wishlist.findOneAndUpdate(query, update, {
      new: true,
    });

    if (updatedWishlist !== null) {
      res.status(200).json({
        success: true,
        message: 'Your Wishlist has been updated successfully!',
        wishlist: updatedWishlist,
      });
    } else {
      const wishlist = new Wishlist({
        product,
        isLiked,
        user: user._id,
      });

      const wishlistDoc = await wishlist.save();

      res.status(200).json({
        success: true,
        message: `Added to your Wishlist successfully!`,
        wishlist: wishlistDoc,
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }

  if (err) {
    console.log(err);
  }
});
// fetch wishlist api

// router.get('/',auth,async function(req,res){
//   const user = req.user._id;
// Wishlist.find({ user, isLiked: true })
// })
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user._id;

    const wishlist = await Wishlist.find({ user, isLiked: true })
      .populate({
        path: 'product',
        select: 'title description price photo',
      })
      .sort('-updated');

    res.status(200).json({
      wishlist,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }

  if (err) {
    console.log(err);
  }
});
//delete wishlist
router.delete('/unlike/:id', auth, async (req, res) => {
  try {
    const { product, isLiked } = req.body;
    const user = req.user;
    const update = {
      product,
      isLiked,
      updated: Date.now(),
    };
    const query = { product: req.params.id, user: user._id };

    const deletedWishlist = await Wishlist.deleteOne(query);
    res.status(200).json({
      success: true,
      message: `wishlist has been deleted successfully!`,
      deletedWishlist,
    });
  } catch (e) {
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
});

module.exports = router;
