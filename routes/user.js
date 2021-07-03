 const express = require('express');
 const Cart = require('../models/Cart');
const role = require('../middlewares/role');
const userModel = require('../models/User');
const multer = require('multer');

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

var passport = require('passport');
const {
  create,
  login,
  getAll,
  getUser,
  editOne,
  deletefield,
  getuserById,
  searchByusername,
} = require('../controllers/user');

const auth = require('../middlewares/auth');
const router = express.Router();


router.post('/register', async (req, res, next) => {
  const { body } = req;
  console.log("hhhhhhhhhhhhhh",body);
  try {
    const user = await create(body);
    // res.json(user);
    // res.status(200).redirect( 'http://localhost:3000/cart/add')
    // const products = req.body.products;

    // const { body ,} = req;
    // lets give it a try at first
    // const { user: { id },} = req;
    const cart = new Cart({ user: user.id,});
    // console.log("body---->",body);
    // console.log("req.body--->",req.body.products);
    // console.log("cart--->",cart);
    cart.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.',
        });
      }
      // if (products){
      // decreaseQuantity(products);
      // }
      res.status(200).json({
        success: true,
        message: "User and his cart created successfully.",
        cartId: data.id,
      });
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  const { body } = req;
  console.log(body);
  try {
    const user = await login(body);
    res.json(user);
  } catch (e) {
    next(e);
  }
});
router.get('/list', async (req, res, next) => {
  try {
    const users = await getAll();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

//get logined user
router.get('/me', auth, async (req, res, next) => {
  try {
    const { user: id } = req;
    const users = await getUser(id);
    const merchant = users.merchant;
    const role = users.role;
    const _id = users._id;
    const fname = users.fname;
    const lname = users.lname;
    const username = users.username;
    const email = users.email;
    const phone = users.phone;
    const city = users.city;
    const country = users.country;
    const address = users.address;
  
    const avatar = users.avatar;
   
    const created = users.created;
    const __v = users.__v;
    const token = users.token;
    const myuser = {merchant, role, _id, fname, lname, username, email,phone, city , country ,address, avatar, created, __v, token};
    console.log("myuse : ",myuser);

    res.json(myuser);
  } catch (e) {
    next(e);
  }
});


// Edit your data

router.put('/edit', auth, async (req, res, next) => {
  const {
    user: { id },
    body,
  } = req;
  try {
    const users = await editOne(id, body);
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// Remove your account
// router.delete('/remove', auth, async (req, res, next) => {
//   const {
//     user: { id },
//   } = req;
//   try {
//     const users = await deletefield(id);
//     res.send('Delete done ');
//   } catch (e) {
//     next(e);
//   }
// });

//serch by id
router.get('/search/:_id', auth, async (req, res, next) => {
  const {
    params: { _id },
  } = req;
  try {
    const users = await getuserById({ _id });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

//search By name
router.get('/name/:username', auth, async (req, res, next) => {
  const {
    params: { username },
  } = req;
  try {
    const user = await searchByusername({ username });
    res.json(user);
    console.log(user);
  } catch (e) {
    next(e);
  }
});



router.delete(
  '/delete/:id',
  auth,
  role.checkRole(role.ROLES.Admin),
  async (req, res) => {
    console.log("req params from delete user------>",req.params.id);
    try {

      const user = await userModel.deleteOne({ _id: req.params.id});
      console.log("Request from delete user----->",user);
      res.status(200).json({
        success: true,
        message: `User has been deleted successfully!`,
        user
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;
