const express = require('express')
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config/config');
const apiRoutes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const { authLimiter } = require('./middlewares/rateLimiter');

const app = express()

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// app.options('*', cors());

app.use('/api', apiRoutes);
app.use('/public', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

if (config.NODE_ENV === "production") {
  app.use('/api/auth', authLimiter);
}

// error handler
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;