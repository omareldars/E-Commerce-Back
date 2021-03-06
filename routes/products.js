const express = require('express');
const { createProduct } = require('../controllers/products');
const path = require('path');
const Product = require('../models/Products');
const router = express.Router();
const multer = require('multer');
const adminAuth = require('../middlewares/admin');
const role = require('../middlewares/role');
const merchantModel = require('../models/Merchant');
const auth = require('../middlewares/auth');


const { 
  
    searchcatTitle,
  
  } = require('../controllers/products')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});


//@routes Get /api/products
//@desc Get all products
//@access public


router.get('/home', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.json({ message: err });
  }
});


//get your 
router.get('/profile', auth, async (req, res, next) => {
  const { user: { id } } = req;
  try {
    const products = await Product.find({ user: id });
    console.log(products);
    res.status(200).json({
      products
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// @routes Post /api/products
// @desc add product
// @access private

router.post('/add',auth ,role.checkRole(role.ROLES.Admin, role.ROLES.Merchant), (req, res,next) => {
  const upload = multer({ storage: storage }).single('photo');
  console.log("add product",req.body);
  upload(req, res, function (err) {
    const { body , user: { id } } = req;
    if (req.file != undefined) body.photo = req.file.path;
    createProduct({ ...body, user: id  })
      .then((product) => res.json(product))
      .catch((e) => {
        console.log(e);
        next(e);
      });
  });
});


// @routes Get /api/products/:productId
// @desc Get  product by its id
// @access public

router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.json(product);
  } catch (err) {
    res.json({ message: err });
  }
});

//@routes delete /api/products/:productId
//@desc delete  specific product
//@access private

// router.delete('/:productId',auth, role.checkRole(role.ROLES.Admin, role.ROLES.Merchant), async (req, res) => {
//   try {
//     const removedProduct = await Product.deleteOne({
//       _id: req.params.productId,
//     });
//     res.json(removedProduct);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// //@routes Put /api/products/:productId
// //@desc update specific product
// //@access private

router.put('/:productId',auth,role.checkRole(role.ROLES.Admin, role.ROLES.Merchant), async (req, res) => {
  try {
    const productfind = await Product.findById(req.params.productId);
    if (!productfind) {
      return res.status(400).json({ msg: 'product not found' });
    }
    const productUpdate = await Product.findByIdAndUpdate(
      req.params.productId,

      req.body,
      { new: true }
    );
    const productSaved = await productUpdate.save();
    res.json(productSaved);
  } catch (error) {
    console.error(error.msg);
    res.status(500).send('server errors');
  }
});

// search product by title
router.get('/title/:product', async (req, res, next) => {
  const product = req.params.product;
  try {
    const products = await Product.find({title: new RegExp(product,"i")}).exec();
    res.json(products);
  } catch (e) {
    next(e);
  }
});



// route.get('/title/:product', auth, async (req, res, next) => {
//   const { params: { product} } = req;
//   try {
//     const products = await searchByTitle({ product });
//     res.json(products);
//   } catch (e) {
//     next(e);
//   }
// });

//search 
// router.get('/search/:ser', async (req, res, next) => {
//   const { params: { ser } } = req;
//   try {
//     const products= await searchcatTitle({ ser });
//     res.json(products);
//   } catch (e) {
//     next(e);
//   }
// });

// router.put(
//   '/:productId/active',
//   auth,
//   role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
//   async (req, res) => {
//     try {
//       // const productId = req.params.id;
//       // const update = req.body.product;
//       // const query = { _id: productId };

//       await Product.findByIdAndUpdate(
//         req.params.productId,

//                req.body,
//               { new: true }
//       );

//       res.status(200).json({
//         success: true,
//         message: 'Product has been updated successfully!'
//       });
//     } catch (error) {
//       res.status(400).json({
//         error: 'Your request could not be processed. Please try again.'
//       });
//     }
//   }
// );

router.delete(
  '/delete/:id',
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      const product = await Product.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: `Product has been deleted successfully!`,
        product
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// get all by titile
router.get('/list/select', auth, async (req, res) => {
  try {
    const products = await Product.find({}, 'title');

    res.status(200).json({
      products
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});




module.exports = router;



