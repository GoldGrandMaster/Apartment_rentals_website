const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: [tokenTypes.ACCESS, tokenTypes.REFRESH],
      required: true
    },
    expires: {
      type: Date,
      required: true
    },
    blacklisted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamp: true
  }
)

tokenSchema.plugin(toJSON);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;