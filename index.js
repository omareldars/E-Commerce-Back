const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user');
const merchantRouter = require('./routes/merchant');
const orderRouter = require('./routes/order');
const categoryRouter = require('./routes/category');
const cartRouter = require('./routes/cart');
const productsRouter = require('./routes/products');
const reviewRouter = require('./routes/review');
const contactRouter = require('./routes/contact');
const app = express();
const PORT = process.env.PORT || 3000;

//init middleware
app.use(express.json());
app.use(express.urlencoded());
// app.use(cors());

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use('/image', express.static('image'));

// const app = express();
mongoose
  .connect('mongodb://localhost:27017/angular', { useUnifiedTopology: true })
  .then(() => {
    console.log('connect mongodb successfully');
  })

  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// DB Error Handling
app.get((err, req, res, next) => {
  console.log(err);
  if (err.code === 11000) {
    res.status(402).send('There was a duplicate key error');
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json(err.errors);
  }
  if (err.code === 11000) {
    res
      .status(422)
      .json({ statusCode: 'ValidationError', property: err.keyValue });
  }
  if (err.message === 'UN_AUTHENTICATED') {
    res.status(401).json({ statusCode: 'UN_AUTHENTICATED' });
  }
  if (err.message === 'UN_AUTHENTICATED') {
    res.status(400).json({ statusCode: 'Bad request' });
  }
  res.status(503).end();
});

app.use(express.json()); //middleware

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/users', userRouter);
app.use('/merchants', merchantRouter);
app.use('/products', productsRouter);
app.use('/orders', orderRouter);
app.use('/categories', categoryRouter);
app.use('/cart', cartRouter);
app.use('/review', reviewRouter);
app.use('/contact', contactRouter);
app.get('/', function (req, res) {
  res.send('Hello World !!!!!');
});

app.listen(PORT, () => {
  console.info(`App is up and ready on ${PORT}`);
});
