const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	nameEng: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	googleMap: {
		type: String,
		required: true,
	},
	rating: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
