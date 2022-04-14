const mongoose = require('mongoose');
require('dotenv').config();

// set up mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => console.log('mongoDB error.'));

db.once('open', () => console.log('mongoDB connected.'));

module.exports = db;
