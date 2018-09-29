const router = require('express-promise-router')();
const passport = require('passport');

const controller = require('../controllers/auth');

router.post('/signup', controller.signUp);
router.post('/signin', passport.authenticate('local', { session: false }), controller.signIn);
router.post('/oauth/google', passport.authenticate('google-plus-token', { session: false }), controller.signIn);
router.post('/oauth/facebook', passport.authenticate('facebook-token', { session: false }), controller.signIn);
router.post('/refreshToken', controller.refreshToken);

module.exports = router;