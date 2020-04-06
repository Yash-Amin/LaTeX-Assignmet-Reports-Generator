const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('./functions/Users');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
                // passReqToCallback: true
            },
            (email, password, done) => {

                
                userModel.getUser(email, function(err, user) {
                    if (err) {
                        console.log(err);
                    }
                    // Check if user exists
                    if (err || !user) {
                        // req.flash('err', 'Email is not registered');
                        return done(null, false, {
                            message: 'Email is not registered'
                        });
                    }

                    bcrypt.compare(password, user.password, (err, match) => {
                        if (match) {
                            delete user.password;
                            return done(null, user);
                        } else if (!err) {
                            // req.flash('err', 'Invalid password');
                            return done(null, false, {
                                message: 'Invalid Password'
                            });
                        } else {
                            done(null, false, { message: 'Server error' });
                        }
                    });
                });
            }
        )
    );

    passport.serializeUser(function(user, done) { 
        done(null, user.email);
    });

    passport.deserializeUser(function(id, done) { 
        userModel.getUser(id, function(err, user) { 
            if (err) {
                done(err, null);
            } else {
                done(null, user);
            }
        });
    });
};
