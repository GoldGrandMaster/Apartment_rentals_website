const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const apartmentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    previewImage: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    areaSize: {
      type: Number,
      required: true
    },
    roomsNo: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    realtor: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

apartmentSchema.plugin(toJSON);
apartmentSchema.plugin(paginate);

const Apartment = mongoose.model('apartment', apartmentSchema);

module.exports = Apartment;