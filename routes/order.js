

// module.exports = orderRouter;
const express = require('express');
const route = express.Router();
const { 
createOrder,
  getAll,
  readById,
  editOrder,
  deleteById,
  home,
  searchcatTitle,
  searchByUser

} = require('../controllers/ordersController')

const Order = require('../models/Order');

const auth = require('../middlewares/auth')


//get all 
route.get('/all', async (req, res, next) => {
  try {
    const orders = await getAll();
    res.json(orders);
  } catch (e) {
    next(e);
  }
});

//Home 
route.get('/home', async (req, res, next) => {
  try {
   
    Order.find({}).lean().populate('user').then((order) => {
      res.json(order)
    })
  } catch (e) {
    next(e);

  }
})



//get your 
route.get('/profile', auth, async (req, res, next) => {
  const { user: { id } } = req;
  try {
    const order = await getAll({ user: id });
    res.json(order);

  } catch (e) {
    next(e);

  }
});


route.post('/add', auth, async (req, res, next) => {
  console.log(req.user);
  
    const { body, user: { id } } = req;
   
    createOrder({ ...body, user: id }).then(order => res.json(order)).catch(e => {
      console.log(e);
      next(e)
    });
  });

//edit one 
route.patch('/:_id', auth, async (req, res, next) => {
  const { params: { _id }, body, user: { id } } = req;
  try {
    const order = await Order.findById(_id);
    // console.log(order.user);
    // console.log(id);
    if (order.user.equals(id)) {
      const orders = await editOrder({ _id }, body);
      res.json(orders);
    } else { res.send("You are not owner") }
  } catch (e) {
    next(e);
  }
});

//Delete 
route.delete('/:_id', auth, async (req, res, next) => {
  const { params: { _id }, user: { id } } = req;
  try {
    const order = await Order.findById(_id);
    // console.log(order.user);
    // console.log(id);
    if (order.user.equals(id)) {
    const orders = await deleteById(_id);
    res.send('Delete Done')
    } else { res.send("You are not owner") }
  }catch (e) {
    next(e);
  }
});

//search 
route.get('/search/:ser', auth, async (req, res, next) => {
  const { params: { ser } } = req;
  try {
    const orders = await searchcatTitle({ ser });
    res.json(orders);
  } catch (e) {
    next(e);
  }
});


//search by owner
route.get('/owner/:user', auth, async (req, res, next) => {
  const { params: { user } } = req;
  try {
    const orders = await searchByUser({ user });
    res.json(orders);
  } catch (e) {
    next(e);
  }
});




module.exports = route;
