const express = require('express');
const passport = require('passport');
const controller = require('../controllers/user');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getProfile);

module.exports = router;