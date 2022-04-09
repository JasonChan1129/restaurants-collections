const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const restaurantList = require('./restaurant.json').results;
const Restaurant = require('./models/restaurant');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const res = require('express/lib/response');
const restaurant = require('./models/restaurant');
const port = 3000;
require('dotenv').config();

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

app.get('/', (req, res) => {
	return Restaurant.find()
		.lean()
		.then(restaurants => {
			res.render('index', { restaurants });
		})
		.catch(error => console.log(error));
	// res.render('index', { restaurants: restaurantList });
});

app.get('/search', (req, res) => {
	const keyword = req.query.keyword.trim();
	const regExp = new RegExp(keyword, 'gi');
	const restaurants = restaurantList.filter(restaurant => {
		return restaurant.name.match(regExp) || restaurant.category.match(regExp);
	});
	res.render('index', { restaurants: restaurants, keyword: keyword });
});

app.get('/restaurants/new', (req, res) => {
	res.render('new');
});

app.post('/restaurants/new', (req, res) => {
	const { name, nameEng, category, image, location, phone, googleMap, rating, description } =
		req.body;
	return Restaurant.create({
		name: name,
		nameEng: nameEng,
		category: category,
		image: image,
		location: location,
		phone: phone,
		googleMap: googleMap,
		rating: rating,
		description: description,
	})
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

app.get('/restaurants/:id', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.lean()
		.then(restaurant => res.render('show', { restaurant }))
		.catch(error => console.log(error));
	// const restaurant = restaurantList.find(restaurant => restaurant.id.toString() === id);
	// res.render('show', { restaurant: restaurant });
});

app.get('/restaurants/:id/edit', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.lean()
		.then(restaurant => {
			res.render('edit', { restaurant });
		})
		.catch(error => console.log(error));
});

app.post('/restaurants/:id/edit', (req, res) => {
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

app.post('/restaurants/:id/delete', (req, res) => {
	const id = req.params.id;
	return Restaurant.findById(id)
		.then(restaurant => restaurant.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

app.listen(port, () => {
	console.log(`Server is listening to localhost: ${port}`);
});
