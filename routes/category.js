const express = require('express');
const router = express.Router();
const passport = require('passport');
const store = require('../helpers/store')

// Bring in Models & Helpers
const Category = require('../models/Categories');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
// const store = require('../helpers/store');

router.post('/add', auth, role.checkRole(role.ROLES.Admin), (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const isActive = req.body.isActive;

  if (!description || !name) {
    return res
      .status(400)
      .json({ error: 'You must enter description & name.' });
  }

  const category = new Category({
    name,
    description,
    isActive
  });
console.log("hhhhhhhhhhhhhhhhhh",category );
 
  category.save((err, data) => {
    if (err) {
        console.log("---->",err);
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: `Category has been added successfully!`,
      category: data
    });
  });
});

// fetch store categories api
router.get('/list', (req, res) => {
  Category.find({ isActive: true }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
    res.status(200).json({
      categories: data
    });
  });
});

// fetch categories api
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      categories
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch category api by id
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    console.log("hhhhhhhhhhhhhhh",categoryId);

    const categoryDoc = await Category.findOne({_id: categoryId}).populate({path:'Products', name:'title'});
    console.log("ccccccccccccccccccccccc",categoryDoc);
    if (!categoryDoc) {
      return res.status(404).json({
        message: 'No Category found.'
      });
    }
console.log("hhhhhhhhhhhhhhh",categoryDoc);
    res.status(200).json({
      category: categoryDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// router.put('/:id', auth, role.checkRole(role.ROLES.Admin), async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const update = req.body.category;
//     const query = { _id: categoryId };

//     await Category.findOneAndUpdate(query, update, {
//       new: true
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Category has been updated successfully!'
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: 'Your request could not be processed. Please try again.'
//     });
//   }
// });

// router.put(
//   '/:id/active',
//   auth,
//   role.checkRole(role.ROLES.Admin),
//   async (req, res) => {
//     try {
//       const categoryId = req.params.id;
//       const update = req.body.category;
//       const query = { _id: categoryId };

//       // disable category(categoryId) products
//       if (!update.isActive) {
//         const categoryDoc = await Category.findOne(
//           { _id: categoryId, isActive: true },
//           'products -_id'
//         ).populate('products');

//         store.disableProducts(categoryDoc.products);
//       }

//       await Category.findOneAndUpdate(query, update, {
//         new: true
//       });

//       res.status(200).json({
//         success: true,
//         message: 'Category has been updated successfully!'
//       });
//     } catch (error) {
//       res.status(400).json({
//         error: 'Your request could not be processed. Please try again.'
//       });
//     }
//   }
// );


router.put('/:categoryId',auth,role.checkRole(role.ROLES.Admin), async (req, res) => {
    try {
      const categoryfind = await Category.findById(req.params.categoryId);
      if (!categoryfind) {
        return res.status(400).json({ msg: 'category not found' });
      }
      const categoryUpdate = await Category.findByIdAndUpdate(
        req.params.categoryId,
  
        req.body,
        { new: true }
      );
      const categorySaved = await categoryUpdate.save();
      res.json(categorySaved);
    } catch (error) {
      console.error(error.msg);
      res.status(500).send('server errors');
    }
  });



router.delete(
  '/delete/:id',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    try {
      const product = await Category.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: `Category has been deleted successfully!`,
        product
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);


router.put(
  '/:id/active',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    try {
      const categoryId = req.params.id;
      const update = req.body.category;
      const query = { _id: categoryId };

      // disable category(categoryId) products
      if (!update.isActive) {
        const categoryDoc = await Category.findOne(
          { _id: categoryId, isActive: true },
          'products -_id'
        ).populate('products');

        store.disableProducts(categoryDoc.products);
      }

      await Category.findOneAndUpdate(query, update, {
        new: true
      });

      res.status(200).json({
        success: true,
        message: 'Category has been updated successfully!'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);
module.exports = router;
