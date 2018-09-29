const jwt = require('jsonwebtoken');
const keys = require('../config/config');

const User = require('../models/User');
const Session = require('../models/Session');
const errorHandler = require('../utils/errorHandler');
const generateTokens = require('../services/auth').generateTokens;

exports.signIn = async (req, res) => {
  const user = req.user;
	const tokens = await generateTokens(user._id);
	
	res.status(200).json({
		accessToken: `Bearer ${tokens.accessToken}`,
		refreshToken: tokens.refreshToken,
		userId: user._id,
	});
};

exports.signUp = async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  
	if (user) {
		return res.status(409).json({ message: 'Email is already in use' });
	}
	
	const newUser = new User({
    method: 'local',
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
	});
	
	await newUser.save();
	
	const tokens = await generateTokens(newUser._id);
	
	res.status(201).json({
		accessToken: `Bearer ${tokens.accessToken}`,
		refreshToken: tokens.refreshToken,
		userId: newUser._id,
	});
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
