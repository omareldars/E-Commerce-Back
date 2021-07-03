const Product = require('../models/Products');

exports.disableProducts = products => {
  let bulkOptions = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { isActive: false }
      }
    };
  });

  Product.bulkWrite(bulkOptions);
};