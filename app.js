const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

const routes = require('./routes');
// connect to mongoDB
require('./config/mongoose');

const port = process.env.PORT || 3000;

const app = express();

// set up view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(routes);

app.listen(port, () => {
	console.log(`Server is listening to localhost:${port}`);
});
