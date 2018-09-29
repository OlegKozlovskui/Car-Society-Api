const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('../models/User');
const config = require('../config/config');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_TOKEN_SECRET
};

const localOptions = {
  usernameField: 'email'
};

const googleOptions = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET
};

const facebookOptions = {
  clientID: config.FACEBOOK_CLIENT_ID,
  clientSecret: config.FACEBOOK_CLIENT_SECRET
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select('email id');
        if (!user) {
          return done(null, false);
        }
        
        done(null, user);
      } catch(err) {
        done(err, false);
      }
    })
  );
  
  passport.use(
    new LocalStrategy(localOptions, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false);
        }
        
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'invalid password' });
        }
        
        done(null, user);
      } catch(err) {
        done(err, false);
      }
    })
  );
  
  passport.use(
    new GooglePlusTokenStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ "google.id": profile.id });
        if (user) {
          return done(null, user);
        }
        
        const newUser = new User({
          method: 'google',
          google: {
            id: profile.id,
          },
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
          email: profile.emails[0].value,
        });
        
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    })
  );
  
  passport.use(
    new FacebookTokenStrategy(facebookOptions, async (accessToken, refreshToken, profile, done) => {
      console.log('accessToken', accessToken);
      
      try {
        const user = await User.findOne({ "facebook.id": profile.id });
        if (user) {
          return done(null, user);
        }
        
        const newUser = new User({
          method: 'facebook',
          facebook: {
            id: profile.id,
          },
          firstName: profile.name.familyName,
          lastName: profile.name.givenName,
          email: profile.emails[0].value,
        });
        
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    })
  );
};
