const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const User = require('../models/User');
const Session = require('../models/Session');
const errorHandler = require('../utils/errorHandler');
const generateTokens = require("../services/auth").generateTokens;

exports.login = async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (user) {
    const isPassMatch = bcrypt.compareSync(req.body.password, user.password);
    if (isPassMatch) {
      try {
        const tokens = await generateTokens(user._id);
        res.status(200).json({
          accessToken: `Bearer ${tokens.accessToken}`,
          refreshToken: tokens.refreshToken,
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      } catch (e) {
        errorHandler(res, e);
      }
    } else {
      res.status(401).json({
        massage: 'Wrong password'
      })
    }
  } else {
    res.status(404).json({
      massage: 'Wrong credentials'
    })
  }
};

exports.register = async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({email: req.body.email});
  if (user) {
    res.status(409).json({
      message: 'User already exist',
    })
  } else {
    const salt = bcrypt.genSaltSync(12);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
    });

    try {
      await newUser.save();
      res.status(201).json(newUser);
    } catch (e) {
      errorHandler(res, e);
    }
  }
};

exports.refreshToken = async (req, res) => {
  const token = req.body.refreshToken;

  try {
    await jwt.verify(token, keys.refreshSecret);
    const sessionInfo = await Session.findOne({refreshToken: token});
    if (sessionInfo) {
      try {
        const tokens = await generateTokens(sessionInfo.userId);
        res.status(200).json({
          accessToken: `Bearer ${tokens.accessToken}`,
          refreshToken: tokens.refreshToken,
        });
      } catch (e) {
        errorHandler(res, e);
      }
    } else {
      res.status(404).json({
        massage: 'Wrong refresh token'
      });
    }
  } catch (e) {
    res.status(403).json({
      massage: 'Refresh token expired - session ended'
    })
  }
};
