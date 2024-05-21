const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');

mongoose.connect(config.MONGODB_URL).then(() => {
  console.log('Connected to MongoDB');

  app.listen(config.PORT, () => {
    console.log(`Listening to port ${config.PORT}`);
  });
});