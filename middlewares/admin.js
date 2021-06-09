const User = require('../models/User');
const bcrypt = require('bcryptjs');
module.exports = function (req, res, next) {
    // if(!req.user.isAdmin) return res.status(403).send('Access denied.');
    if(req.user.role != 'ROLE_ADMIN') return res.status(403).send('Access denied.');
    
    next();
}

