const express = require('express');

const Restaurant = require('../../models/restaurant');

const router = express.Router();

// render index page
router.get('/', (req, res) => {
	const sort = req.query.sort;
	return Restaurant.find()
		.lean()
		.sort(sort)
		.then(restaurants => {
			res.render('index', { restaurants });
		})
		.catch(error => console.log(error));
});

// handle search restaurants
router.get('/search', (req, res) => {
	const keyword = req.query.keyword.trim();
	const regExp = new RegExp(keyword, 'gi');
	const sort = req.query.sort;
	Restaurant.find({ $or: [{ name: regExp }, { nameENG: regExp }, { category: regExp }] })
		.lean()
		.sort(sort)
		.then(restaurant => {
			res.render('index', { restaurants: restaurant, keyword });
		})
		.catch(error => console.log(error));
});

module.exports = router;
