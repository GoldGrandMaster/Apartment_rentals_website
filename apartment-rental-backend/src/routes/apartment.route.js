const express = require('express');
const validate = require('../middlewares/validate');
const apartmentValidation = require('../validations/apartment.validation');
const apartmentController = require('../controllers/apartment.controller');
const { jwtAuth, requireRole } = require('../middlewares/auth');
const upload = require('../middlewares/multer');

const router = express.Router();

router.route('/')
  .get(jwtAuth, validate(apartmentValidation.getApartments), apartmentController.getApartments)
  .post(jwtAuth, requireRole('realtor'), upload.single('previewImage'), validate(apartmentValidation.createApartment), apartmentController.createApartment);

router.route('/:id')
  .get(jwtAuth, validate(apartmentValidation.getApartment), apartmentController.getApartment)
  .put(jwtAuth, upload.single('previewImage'), validate(apartmentValidation.updateApartment), apartmentController.updateApartment)
  .delete(jwtAuth, validate(apartmentController.deleteApartment), apartmentController.deleteApartment);

module.exports = router;