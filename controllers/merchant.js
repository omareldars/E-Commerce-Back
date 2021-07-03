const User = require('../models/Merchant');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncSign = promisify(jwt.sign);


const create = (user) => User.create(user);

module.exports = {
    create,
}