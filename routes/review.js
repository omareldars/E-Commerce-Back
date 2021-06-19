const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const Review = require('../models/review');
const Product = require('../models/Products');
const auth = require('../middlewares/auth');

router.post('/add', auth, (req, res) => {
  const user = req.user;

  const review = new Review(Object.assign(req.body, { user: user._id }));

  review.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Your review has been added successfully and will appear when approved!`,
      review: data,
    });
  });
});

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate({
        path: 'User',
        select: 'fname',
      })
      .populate({
        path: 'Products',
        select: 'title',
      })
      .sort('-created');

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
});

//get review by id 
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    res.json(review);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const update = req.body;
    const query = { _id: reviewId };

    await Review.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'review has been updated successfully!',
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
});

// approve review
router.put('/approve/:reviewId', auth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: 'Approved',
      isActive: true,
    };

    await Review.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
});

// reject review
router.put('/reject/:reviewId', auth, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const query = { _id: reviewId };
    const update = {
      status: 'Rejected',
    };

    await Review.findOneAndUpdate(query, update, {
      new: true,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
    });
  }
});

router.delete('/delete/:id', (req, res) => {
  Review.deleteOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: `review has been deleted successfully!`,
      review: data,
    });
  });
});

module.exports = router;
