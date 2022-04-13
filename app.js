const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const Restaurant = require('./models/restaurant');
const mongoose = require('mongoose');
const port = 3000;
require('dotenv').config();
// import Google Maps Client
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

// set up view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// set up mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => console.log('mongoDB error.'));

db.once('open', () => console.log('mongoDB connected.'));

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// render index page
app.get('/', (req, res) => {
	return Restaurant.find()
		.lean()
		.then(restaurants => {
			res.render('index', { restaurants });
		})
		.catch(error => console.log(error));
});

// handle search restaurants
app.get('/search', (req, res) => {
	const keyword = req.query.keyword.trim();
	const regExp = new RegExp(keyword, 'gi');
	Restaurant.find({ $or: [{ name: regExp }, { category: regExp }] })
		.lean()
		.then(restaurant => {
			res.render('index', { restaurants: restaurant, keyword });
		})
		.catch(error => console.log(error));
});

// render add new restaurant page
app.get('/restaurants/new', (req, res) => {
	res.render('new');
});

// handle add restaurants to database
app.post('/restaurants', (req, res) => {
	const { name, nameEng, category, image, location, phone, googleMap, rating, description } =
		req.body;
	return Restaurant.create({
		name,
		nameEng,
		category,
		image,
		location,
		phone,
		googleMap,
		rating,
		description,
	})
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

// render specific restaurant's details
app.get('/restaurants/:id', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.lean()
		.then(restaurant => res.render('show', { restaurant }))
		.catch(error => console.log(error));
});

// render edit restaurant page
app.get('/restaurants/:id/edit', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.lean()
		.then(restaurant => {
			res.render('edit', { restaurant });
		})
		.catch(error => console.log(error));
});

// handle edit restaurant
app.put('/restaurants/:id', (req, res) => {
	const { name, nameEng, category, image, location, phone, googleMap, rating, description } =
		req.body;
	const id = req.params.id;
	Restaurant.findById(id)
		.then(restaurant => {
			restaurant.name = name;
			restaurant.nameEng = nameEng;
			restaurant.category = category;
			restaurant.image = image;
			restaurant.location = location;
			restaurant.phone = phone;
			restaurant.googleMap = googleMap;
			restaurant.rating = rating;
			restaurant.description = description;
			restaurant.save();
		})
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

// handle delete a restaurant
app.post('/restaurants/:id/delete', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.then(restaurant => restaurant.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

// handle auto-fill restaurant details when adding a new restaurant
app.post('/restaurants/request', async (req, res) => {
	const input = req.body.input;
	try {
		// to get a specific place_id from Google Places API
		const findPlaceRes = await client.findPlaceFromText({
			params: {
				input: input,
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

app.listen(port, () => {
	console.log(`Server is listening to localhost: ${port}`);
});
