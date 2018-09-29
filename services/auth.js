const jwt = require('jsonwebtoken');

const config = require('../config/config');
const Session = require('../models/Session');

exports.generateTokens = async (userId) => {
  const accessToken = jwt.sign({userId}, config.JWT_TOKEN_SECRET, { expiresIn: config.JWT_TOKEN_LIFE });
  const refreshToken = jwt.sign({ type: 'refresh' }, config.REFRESH_TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_LIFE });
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