const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
})

const loginWithJwt = catchAsync(async (req, res) => {
  if (!req.user)
    res.status(httpStatus.UNAUTHORIZED).send("Not authorized");
  else {
    res.send(req.user)
  }
})

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
})

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
})

module.exports = {
  login,
  logout,
  loginWithJwt,
  register,
  refreshTokens,
}