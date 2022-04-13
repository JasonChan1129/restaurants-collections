const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// import Google Maps Client
const { Client } = require('@googlemaps/google-maps-services-js');
const routes = require('./routes');
require('dotenv').config();

const port = 3000;

const app = express();

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
app.use(methodOverride('_method'));
app.use(routes);

const client = new Client({});
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
