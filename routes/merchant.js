const express = require('express');
const role = require('../middlewares/role');
const adminAuth = require('../middlewares/admin');
const merchantModel = require('../models/Merchant');
var passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey("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")
sgMail.setApiKey("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");
const {create,} = require('../controllers/merchant');
const auth = require('../middlewares/auth');
const { ROLES } = require('../middlewares/role');
const router = express.Router();



// delete merchant
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


// request to be merchant
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
      const msg = {
        to: email, // Change to your recipient
        from: 'Crafts Maker <craftsmakerteam@gmail.com>', // Change to your verified sender
        subject: 'Seller Request',
        text: 'We recieved your request and will be handled shortly',
        html: '<strong>We recieved your request and will be handled shortly</strong>',
      };

      await sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent: from seller request')
        })
        .catch((error) => {
          console.error(JSON.stringify(error));
        });

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



// list approves merchants
  router.get(
    '/list/approval',
    auth,
    role.checkRole(role.ROLES.Admin),
    async (req, res) => {
      try {
        const merchants = await merchantModel.find({status:"Waiting Approval"}).sort('-created');
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



// fetch all merchants api
router.get(
    '/list',
    auth,
    role.checkRole(role.ROLES.Admin),
    async (req, res) => {
      try {
        const merchants = await merchantModel.find({status:"Approved"}).sort('-created');
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





// create user for merchant request
const createMerchantUser = async (email, name, merchant, host) => {
    const fname = name;
    // const lname= '';
    console.log("merchant----->",merchant);
    const existingUser = await User.findOne({ email });
    console.log("exsiting----->",existingUser);
    if (existingUser) {
      const query = { _id: existingUser._id };
      const merchantDoc = await merchantModel.findOne({
        email
      });
      console.log("merchantDoc---->",merchantDoc);
      const msg = {
        to: email, // Change to your recipient
        from: 'Crafts Maker <craftsmakerteam@gmail.com>', // Change to your verified sender
        subject: 'Welcome',
        text: 'Welcome to Our Website, you are a merchant now',
        html: '<strong>Welcome to Our Website</strong>',
      };
      await sgMail.send(msg).then(() => {
          console.log('Email sent: from user exist')
        }).catch((error) => {
          console.error(JSON.stringify(error));
        });

      const updated  = await User.updateOne(query,{$set : {merchant:merchant, role: role.ROLES.Merchant}});
      console.log("updated---->",updated);
      return await User.updateOne(query,{$set : {merchant:merchant, role: role.ROLES.Merchant}});
    }
    if (!existingUser){
      const buffer = await crypto.randomBytes(48);
      const resetToken = buffer.toString('hex');
      const resetPasswordToken = resetToken;
      const phone = 11111111111;
      const lname="ahmed";
      const city = "city";
      const country = "country";
      const username = fname+"user";

      const user = new User({email:email,
        fname:fname,
        lname:lname,
        resetPasswordToken:resetPasswordToken,
        password: "12345678hgf",
        merchant, role: role.ROLES.Merchant,
        phone:phone, city:city, country:country,
        username:username});
        console.log("user from user not exist after create constructor",user);

      mailbody = "This is to register as a user for merchant purpose: host is  http://"+host+"/merchants/singup/"+resetToken+" \n \n for email: "+email;
      const msg = {
        to: email, // Change to your recipient
        from: 'Crafts Maker <craftsmakerteam@gmail.com>', // Change to your verified sender
        subject: 'Welcome',
        text:mailbody,
        // text: 'This is to register as a user for merchant purpose, <host> <resetToken> <email>',
        // html: '<strong>Welcome to Our Website</strong>',
      };
      console.log("from user not exist email data", msg);
      await sgMail.send(msg).then(() => {
          console.log('Email sent: from user not exist')
        }).catch((error) => {
          console.error(JSON.stringify(error));
        });
      // user.save();
      // const saved = await user.save();
      // console.log("saved---->",saved);
      const ay7aaga= await user.save()
      console.log("ay 7aga --->",ay7aaga);
      return ay7aaga
    }
  }


//
// // approve merchant
// router.put('/approve/:merchantId', auth, role.checkRole(role.ROLES.Admin),async (req, res) => {
//   try {
//     const merchantId = req.params.merchantId;
//     console.log("Id---->",merchantId);
//     const query = { _id: merchantId };
//     const update = {
//       status: 'Approved',
//       isActive: true
//     };
//     console.log("Query---->",merchantId);
//     const merchantDoc = await merchantModel.findOneAndUpdate(query, update, {
//       new: true
//     });
//     console.log("Host---->", req.headers.host);
//     console.log("from approve ---- this is merchant---->", merchantDoc);
//     await createMerchantUser(
//       merchantDoc.email,
//       merchantDoc.name,
//       merchantId,
//       req.headers.host
//     );
//
//     res.status(200).json({
//       success: true
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: 'Your request could not be processed. Please try again.'
//     });
//   }
// });
//
//
// approve merchant
router.put('/approve/:merchantId', auth, role.checkRole(role.ROLES.Admin),async (req, res) => {
  try {
    const merchantId = req.params.merchantId;
    console.log("Id---->",merchantId);
    const query = { _id: merchantId };
    const update = {
      status: 'Approved',
      isActive: true
    };
    console.log("Query---->",merchantId);
    const merchantDoc = await merchantModel.findOneAndUpdate(query, update, {
      new: true
    });
    console.log("Host---->", req.headers.host);
    console.log("from approve ---- this is merchant---->", merchantDoc);
    const responseuser = await createMerchantUser(
      merchantDoc.email,
      merchantDoc.name,
      merchantId,
      req.headers.host
    );
    console.log("response from create user from merchant ----> ",responseuser);
    console.log("saba7o foll");

    res.status(200).json({
      success: true
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.',
      message: error.message
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

      const query = { _id: userDoc._id };
      const update = {
        email,
        fname,
        lname,
        password: password,
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
        error: 'Couldn\'t create user for this merchant.'
      });
    }
  });





module.exports = router;
