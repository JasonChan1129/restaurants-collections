const req = require('express/lib/request');
const mongoose = require('mongoose');
const Restaurant = require('../restaurant');
const restaurantList = require('../../restaurant.json').results;
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => console.log('mongoDB error.'));

db.once('open', () => {
	console.log('mongoDB connected.');
	restaurantList.forEach(restaurant => {
		Restaurant.create({
			name: restaurant.name,
			nameEng: restaurant['name_en'],
			category: restaurant.category,
			image: restaurant.image,
			location: restaurant.location,
			phone: restaurant.phone,
			googleMap: restaurant.google_map,
			rating: restaurant.rating,
			description: restaurant.description,
		});
	});
	console.log('done!');
});
