const catchAsync = require('../utils/catchAsync');
const apartmentService = require('../services/apartment.service');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createApartment = catchAsync(async (req, res) => {
  req.body.previewImage = req.file.filename;
  const apartment = await apartmentService.createApartment(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(apartment);
});

const getApartments = catchAsync(async (req, res) => {
  const minmax = pick(req.query, ['minPrice', 'maxPrice', 'minArea', 'maxArea']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filters = {};

  if (req.query.mine)
    filters.realtor = req.user.id;
  if (minmax.minPrice) filters.price = { ...(filters.price || {}), $gte: minmax.minPrice };
  if (minmax.maxPrice) filters.price = { ...(filters.price || {}), $lte: minmax.maxPrice };
  if (minmax.minArea) filters.areaSize = { ...(filters.areaSize || {}), $gte: minmax.minArea };
  if (minmax.maxArea) filters.areaSize = { ...(filters.areaSize || {}), $lte: minmax.maxArea };

  const apartments = await apartmentService.queryApartments(filters, options);
  res.send(apartments);
})

const getApartment = catchAsync(async (req, res) => {
  const apartment = await apartmentService.getApartmentById(req.params.id).populate('realtor', 'name');
  if (!apartment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  }
  res.send(apartment);
})

const updateApartment = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.previewImage = req.file.filename;
  }
  const apartment = await apartmentService.getApartmentById(req.params.id);
  if (!apartment)
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  if (apartment.realtor.toString() !== req.user.id)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not authorized");
  const updated = await apartmentService.updateApartmentById(req.params.id, req.body);
  res.send(updated);
})

const deleteApartment = catchAsync(async (req, res) => {
  const apartment = await apartmentService.getApartmentById(req.params.id);
  if (!apartment)
    throw new ApiError(httpStatus.NOT_FOUND, "Apartment not found");
  if (apartment.realtor.toString() !== req.user.id)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not authorized");
  const removed = await apartmentService.deleteApartmentById(req.params.id);
  res.send(removed);
})

module.exports = {
  getApartment,
  getApartments,
  createApartment,
  updateApartment,
  deleteApartment
}