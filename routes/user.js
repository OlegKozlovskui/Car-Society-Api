const router = require('express-promise-router')();
const passport = require('passport');

const controller = require('../controllers/user');

router.get('/current', passport.authenticate('jwt', { session: false }), controller.getUser);

module.exports = router;