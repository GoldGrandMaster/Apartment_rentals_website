const Joi = require('joi');

const createApartment = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().default(''),
    areaSize: Joi.number().required(),
    roomsNo: Joi.number().required(),
    price: Joi.number().required(),
    latitude: Joi.number(),
    longitude: Joi.number()
  })
}

const getApartments = {
  query: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    minArea: Joi.number(),
    maxArea: Joi.number(),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    mine: Joi.boolean().default(false),
    sortBy: Joi.string(),
    page: Joi.number(),
    limit: Joi.number()
  })
}

const getApartment = {
  param: Joi.object().keys({
    id: Joi.string().required()
  })
}

const updateApartment = {
  param: Joi.object().keys({
    id: Joi.string().required()
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    previewImage: Joi.string(),
    description: Joi.string(),
    areaSize: Joi.number(),
    roomsNo: Joi.number(),
    price: Joi.number(),
    latitude: Joi.number(),
    longitude: Joi.number()
  })
}

const deleteApartment = {
  param: Joi.object().keys({
    id: Joi.string().required()
  })
}

module.exports = {
  getApartment,
  getApartments,
  createApartment,
  updateApartment,
  deleteApartment
}