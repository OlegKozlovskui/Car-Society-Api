const express = require('express');
const passport = require('passport');
const controller = require('../controllers/car');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAllCars);

module.exports = router;