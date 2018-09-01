const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Session = require('../models/Session');

exports.generateTokens = async (userId) => {
  const accessToken = jwt.sign({userId}, keys.jwtSecret, {expiresIn: keys.tokenLife});
  const refreshToken = jwt.sign({type: 'refresh'}, keys.refreshSecret, {expiresIn: keys.refreshTokenLife});
  const newRefreshToken = new Session({
    userId: userId,
    refreshToken
  });
  await newRefreshToken.save();
  return {
    accessToken,
    refreshToken
  }
};