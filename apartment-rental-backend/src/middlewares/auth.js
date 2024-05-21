const httpStatus = require('http-status');
const tokenService = require('../services/token.service');
const ApiError = require('../utils/ApiError');

const jwtAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const user = await tokenService.verifyAccessToken(token);
    req.user = user.toJSON();
    next();
  }
  catch (e) {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Token invalid or expired"));
  }
}

const requireRole = role => async (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Not authorized"));
  }
  else {
    next();
  }
}

module.exports = {
  requireRole,
  jwtAuth
}