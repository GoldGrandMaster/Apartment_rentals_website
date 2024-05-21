const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const apartmentRoutes = require('./apartment.route');

router.use('/auth', authRoutes);
router.use('/apartment', apartmentRoutes);

module.exports = router;