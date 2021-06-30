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
  const upload = multer({ storage: storage }).single('avatar');
  const { body } = req;
  console.log("hhhhhhhhhhhhhh",body);
  try {
    const user = await create(body);
    const cart = new Cart({ user: user.id,});
    cart.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Your request could not be processed. Please try again.',
        });
      }
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
    res.json(users);
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
