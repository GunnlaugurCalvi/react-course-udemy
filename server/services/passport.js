const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys  = require('../config/keys');

const User = mongoose.model('users');

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleID: profile.id })
            .then( existingUser => {
                if (existingUser)
                {
                    //already have a record with the given googleID
                    done(null, existingUser);
                }
                else
                {
                    //we dont have a user record with this google ID
                    new User({
                        googleID: profile.id,
                        name: profile.displayName
                    }).save().then( user => done(null, user));
                }
            });
    })
);
