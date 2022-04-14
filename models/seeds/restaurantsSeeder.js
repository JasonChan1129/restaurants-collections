const Restaurant = require('../restaurant');
const restaurantList = require('../../restaurant.json').results;

const db = require('../../config/mongoose');

db.once('open', () => {
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
