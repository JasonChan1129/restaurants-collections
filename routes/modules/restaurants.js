const express = require('express');

const Restaurant = require('../../models/restaurant');

const router = express.Router();

// render add new restaurant page
router.get('/new', (req, res) => {
	res.render('new');
});

// handle add restaurants to database
router.post('/', (req, res) => {
	const body = req.body;
	return Restaurant.create(body)
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

// render specific restaurant's details
router.get('/:id', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.lean()
		.then(restaurant => res.render('show', { restaurant }))
		.catch(error => console.log(error));
});

// render edit restaurant page
router.get('/:id/edit', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.lean()
		.then(restaurant => {
			res.render('edit', { restaurant });
		})
		.catch(error => console.log(error));
});

// handle edit restaurant
router.put('/:id', (req, res) => {
	const id = req.params.id;
	const body = req.body;
	Restaurant.findById(id)
		.then(restaurant => {
			for (let key in body) {
				restaurant[key] = body[key];
			}
			restaurant.save();
		})
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

// handle delete a restaurant
router.delete('/:id', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.then(restaurant => restaurant.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

module.exports = router;
