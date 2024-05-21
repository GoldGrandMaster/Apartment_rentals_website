const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');
const { tokenTypes } = require('../config/tokens');
const Token = require('../models/token.model');

const loginWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
}

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    return tokenService.generateAuthTokens(user);
  }
  catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error)
  }
}

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
}

module.exports = {
  loginWithEmailAndPassword,
  logout,
  refreshAuth
}