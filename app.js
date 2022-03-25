const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const restaurantList = require('./restaurant.json').results;
const port = 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

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

app.get('/restaurants/:id', (req, res) => {
	const id = req.params.id;
	const restaurant = restaurantList.find(restaurant => restaurant.id.toString() === id);
	res.render('show', { restaurant: restaurant });
});

app.listen(port, () => {
	console.log(`Server is listening to localhost: ${port}`);
});
