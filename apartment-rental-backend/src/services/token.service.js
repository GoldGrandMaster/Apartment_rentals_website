const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Token = require('../models/token.model');
const { tokenTypes } = require('../config/tokens');
const userService = require('../services/user.service');

const generateToken = (userId, expires, type, secret = config.JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  }
  return jwt.sign(payload, secret);
}

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    type,
    user: userId,
    expires,
    blacklisted
  });
  return tokenDoc;
}

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
  const refreshTokenExpires = moment().add(config.JWT_REFRESH_EXPIRATION_DAYS, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  }
}

const verifyToken = async (token, type, secret = config.JWT_SECRET) => {
  const payload = jwt.verify(token, secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
}

const verifyAccessToken = async (token, secret = config.JWT_SECRET) => {
  const payload = jwt.verify(token, secret);
  const userDoc = await userService.getUserById(payload.sub);
  if (!userDoc) {
    throw new Error('User not found');
  }
  return userDoc;
}

module.exports = {
  generateToken,
  generateAuthTokens,
  verifyToken,
  verifyAccessToken
}