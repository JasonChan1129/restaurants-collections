const express = require('express');
// import Google Maps Client
const { Client } = require('@googlemaps/google-maps-services-js');

const router = express.Router();
const client = new Client({});
require('dotenv').config();

// handle auto-fill restaurant details when adding a new restaurant
router.get('/infos', async (req, res) => {
	const restaurant = req.query.input;
	try {
		// to get a specific place_id from Google Places API
		const findPlaceRes = await client.findPlaceFromText({
			params: {
				input: restaurant,
				inputtype: 'textquery',
				language: 'zh-TW',
				key: process.env.GOOGLE_API_KEY,
			},
		});
		const placeID = findPlaceRes.data.candidates[0].place_id;
		// to get place details from Google Places API
		const placeDetailsRes = await client.placeDetails({
			params: {
				place_id: placeID,
				language: 'zh-TW',
				key: process.env.GOOGLE_API_KEY,
			},
		});
		const placeDetailsData = placeDetailsRes.data.result;
		// pass the obtained place details to the 'new' templete
		return res.render('new', { placeDetailsData });
	} catch (err) {
		console.log(err);
		return res.render('new');
	}
});

module.exports = router;
