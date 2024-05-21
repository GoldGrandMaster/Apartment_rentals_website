const httpStatus = require('http-status');
const Apartment = require('../models/apartment.model');
const ApiError = require('../utils/ApiError');

const createApartment = async (userid, apartmentBody) => {
  return Apartment.create({
    ...apartmentBody,
    realtor: userid
  });
}

const queryApartments = async (filter, options) => {
  return Apartment.paginate(filter, options);
}

const getApartmentById = (apartmentId) => {
  return Apartment.findById(apartmentId);
}

const updateApartmentById = async (apartmentId, updateBody) => {
  const apartment = await getApartmentById(apartmentId);
  if (!apartment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  }
  Object.assign(apartment, updateBody);
  await apartment.save();
  return apartment;
}

const deleteApartmentById = async (apartmentId) => {
  const apartment = await getApartmentById(apartmentId);
  if (!apartment) {
    throw new Error(httpStatus.NOT_FOUND, "Apartment not found");
  }
  await apartment.deleteOne();
  return apartment;
}

module.exports = {
  getApartmentById,
  queryApartments,
  createApartment,
  updateApartmentById,
  deleteApartmentById
}