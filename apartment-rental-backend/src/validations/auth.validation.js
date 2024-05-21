const Joi = require('joi');
const roles = require('../config/roles');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .min(8).message("Password must contain at least 8 characters")
      .regex(/^(?=.*[A-Za-z])(?=.*[0-9]).*$/).message("Password must contain at least one letter and one number"),
    role: Joi.string().valid(...roles).default('user'),
    name: Joi.string().required()
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  })
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
}

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
}