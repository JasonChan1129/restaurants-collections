const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const restaurantList = require('./restaurant.json').results;
const mongoose = require('mongoose');
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
	res.render('index', { restaurants: restaurantList });
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
	console.log(req.body);
});

app.get('/restaurants/:id', (req, res) => {
	const id = req.params.id;
	const restaurant = restaurantList.find(restaurant => restaurant.id.toString() === id);
	res.render('show', { restaurant: restaurant });
});

app.listen(port, () => {
	console.log(`Server is listening to localhost: ${port}`);
});
