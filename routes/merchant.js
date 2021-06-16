const express = require('express');
const role = require('../middlewares/role');
const adminAuth = require('../middlewares/admin');
const merchantModel = require('../models/Merchant');
var passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailgun = require("mailgun-js");
const DOMAIN = "https://api.mailgun.net/v3/sandbox7388420c7cdc4cabb89eea66bcfb55d9.mailgun.org";
const mg = mailgun({apiKey: "0ddc7e1e5c34690ea341ac93722288e5-90ac0eb7-0b0bbb44", domain: DOMAIN});
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const mail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  requireTLS: true,
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: 'english.iti41@gmail.com',
      clientId: '1008092525780-0v5ctcelq61dpgd79nbfont6eqp25le9.apps.googleusercontent.com',
      clientSecret: 'cNR9DelAdiNyQ4X33nHTd10u',
      refreshToken: '1//04PdYqR3yElAaCgYIARAAGAQSNwF-L9Irn2b2kuBCTfy1RmssYJexD_347NPWb9T3yJpX-C-anFj61WiLrItgzHJZH0DMXqsCOWs'
      // pass: 'osintake41iti'
    })
  }
});
const {
  create,

} = require('../controllers/merchant');

const auth = require('../middlewares/auth');
const { ROLES } = require('../middlewares/role');
const router = express.Router();

// router.post('/register', async (req, res, next) => {
//   const { body } = req;
//   try {
//     const user = await create(body);
//     res.json(user);
//   } catch (e) {
//     next(e);
//   }
// });

router.delete(
    '/delete/:id',
    auth,
    role.checkRole(role.ROLES.Admin),
    async (req, res) => {
        console.log(req.user.id);
      try {
        if(role.checkRole(role.ROLES.Admin))
        {
            console.log("-----> Role is admin")
        }
        const merchant = await merchantModel.deleteOne({ _id: req.params.id });
        res.status(200).json({
          success: true,
          message: `Merchant has been deleted successfully!`,
          merchant
        });
      } catch (error) {
        res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }
    }
  );



router.post('/seller-request', async (req, res) => {
    try {
      const name = req.body.name;
      const business = req.body.business;
      const phoneNumber = req.body.phoneNumber;
      const email = req.body.email;

      if (!name || !email) {
        return res
          .status(400)
          .json({ error: 'You must enter your name and email.' });
      }

      if (!business) {
        return res
          .status(400)
          .json({ error: 'You must enter a business description.' });
      }

      if (!phoneNumber || !email) {
        return res
          .status(400)
          .json({ error: 'You must enter a phone number and an email address.' });
      }

      const existingMerchant = await merchantModel.findOne({ email });

      if (existingMerchant) {
        return res
          .status(400)
          .json({ error: 'That email address is already in use.' });
      }

      const merchant = new merchantModel({
        name,
        email,
        business,
        phoneNumber,

      });
  console.log(merchant);
      const merchantDoc = await merchant.save();
console.log(merchantDoc);
      res.status(200).json({
        success: true,
        message: `We received your request! we will reach you on your phone number ${phoneNumber}!`,
        merchant: merchantDoc
      });

    } catch (error) {
      return res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  });

// fetch all merchants api
router.get(
    '/list',
    auth,
    role.checkRole(role.ROLES.Admin),
    async (req, res) => {
      try {
        const merchants = await merchantModel.find({}).sort('-created');

        res.status(200).json({
          merchants
        });
      } catch (error) {
        res.status(400).json({
          error: 'Your request could not be processed. Please try again.'
        });
      }
    }
  );




const createMerchantUser = async (email, name, merchant, host) => {
    const fname = name;
    const lname= '';
    console.log("merchant----->",merchant);
    const existingUser = await User.findOne({ email });
  console.log("exsiting----->",existingUser);
    if (existingUser) {
      const query = { _id: existingUser._id };
      // const update = {
      //   merchant,
      //   role: role.ROLES.Merchant
      // };
      // console.log("query------>",query)
      const merchantDoc = await merchantModel.findOne({
        email
      });
  console.log("merchantDoc---->",merchantDoc);
    //   await createMerchantBrand(merchantDoc);
    const data = {
        from: 'Crafts Maker <english.iti41@gmail.com>',
        to: 'omar.a.eldars@gmail.com',
        subject: 'Welcome',
        text: 'Testing some Mailgun awesomness!'
    };
    await mail.sendMail(data, function (error, info){
      if(error){
        console.log("Error------>",error);
      } else {
        console.log("Email Sent------>",info.response);
      }
    });
    //   await mg.messages().send(data, function (error, body) {
    //     console.log("Body------>",body);
    //     console.log("Error------>",error);
    // });
    //   await mailgun.sendEmail(email, 'merchant-welcome', null, name);
    //   const updated = await User.findOneAndUpdate(query, update, {new: true});
    //   const upda = await User.findOneAndUpdate(query, update);
    // const data = {
    //   from: 'Cratf Maker <ekhlasgawish123@gmail.com>',
    //   to: 'omar.a.eldars@gmail.com',
    //   subject: 'Welcome',
    //   text: 'Testing some Mailgun awesomness!'
    //   };
    //   await mg.messages().send(data, function (error, body) {
    //     console.log(body);
    //   });
      const updated  = await User.updateOne(query,{$set : {merchant:merchant, role: role.ROLES.Merchant}});
      console.log("updated---->",updated);
      return await User.updateOne(query,{$set : {merchant:merchant, role: role.ROLES.Merchant}});
    } else {
      const buffer = await crypto.randomBytes(48);
      const resetToken = buffer.toString('hex');
      const resetPasswordToken = resetToken;

      const user = new User({
        email,
        fname,
        lname,
        resetPasswordToken,
        merchant,
        role: role.ROLES.Merchant
      });

    //   await mailgun.sendEmail(email, 'merchant-signup', host, {
    //     resetToken,
    //     email
    //   });

      return await user.save();
    }
  }



  // approve merchant
router.put('/approve/:merchantId', auth, async (req, res) => {
    try {
      const merchantId = req.params.merchantId;
      console.log("from approve ---- this is merchant Id---->", merchantId);
      const query = { _id: merchantId };
      const update = {
        status: 'Approved',
        isActive: true
      };
      // const merchantDoc = await merchantModel.updateOne(query,{$set : {status:'Approved', isActive: true}});
      const merchantDoc = await merchantModel.findOneAndUpdate(query, update, {
        new: true
      });
      console.log("Host---->", req.headers.host);
      console.log("from approve ---- this is merchant---->", merchantDoc);
      await createMerchantUser(
        merchantDoc.email,
        merchantDoc.name,
        merchantId,
        req.headers.host
      );
      console.log("saba7o foll");

      res.status(200).json({
        success: true
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  });



  // reject merchant
router.put('/reject/:merchantId', auth, async (req, res) => {
    try {
      const merchantId = req.params.merchantId;

      const query = { _id: merchantId };
      const update = {
        status: 'Rejected'
      };

      await merchantModel.findOneAndUpdate(query, update, {
        new: true
      });

      res.status(200).json({
        success: true
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  });




//signup with token

router.post('/signup/:token', async (req, res) => {
    try {
      const { email, fname, lname, password } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ error: 'You must enter an email address.' });
      }

      if (!fname || !lname) {
        return res.status(400).json({ error: 'You must enter your full name.' });
      }

      if (!password) {
        return res.status(400).json({ error: 'You must enter a password.' });
      }

      const userDoc = await User.findOne({
        email,
        resetPasswordToken: req.params.token
      });

    //   const salt = await bcrypt.genSalt(10);
    //   const hash = await bcrypt.hash(password, salt);

      const query = { _id: userDoc._id };
      const update = {
        email,
        fname,
        lname,
        password: hash,
        resetPasswordToken: undefined
      };

      await User.findOneAndUpdate(query, update, {
        new: true
      });

      const merchantDoc = await merchantModel.findOne({
        email
      });

    //   await createMerchantBrand(merchantDoc);

      res.status(200).json({
        success: true
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  });





module.exports = router;
