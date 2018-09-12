const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const carRoutes = require('./routes/car');

const app = express();

mongoose.connect('mongodb://localhost:27017/car-society', { useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch(() => console.log('Error connection'));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/api/users', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cars', carRoutes);

module.exports = app;
