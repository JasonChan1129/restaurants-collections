const express = require('express');
const router = express.Router();

const home = require('./modules/home');
const restaurants = require('./modules/restaurants');
const apiRequest = require('./modules/apiRequest');

router.use('/', home);
router.use('/restaurants', restaurants);
router.use('/google', apiRequest);

module.exports = router;
