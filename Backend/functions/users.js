const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

let db = require('../db');

let model = require('../models/users')(db, Sequelize);

function hashPassword(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            callback(err);
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                callback(err);
            }
            callback(false, hash);
        });
    });
}

/**
 *
 * @param {object {email, password, role}} user
 * @param {Function [err]} callback
 */
function createUser(user, callback) {
    getUser(user.email, (err, foundUser) => {
        if (!err && foundUser) {
            return callback({ error: true, message: 'User exists' });
        } 
        hashPassword(user.password, (err, hash) => {
            if (err) {
                return callback({ error: true, message: 'Server Error.' });
            }
            user.password = hash;
            model
                .create(user, { raw: true })
                .then(dbUser => {
                    console.log(`[+] User created: ${dbUser}`);
                    callback(false, dbUser);
                })
                .catch(err => {
                    console.log(err);
                    callback({ error: true, message: 'Server error.' });
                });
        });
    });
}

/**
 *
 * @param {string} email
 * @param {Function [err , user] } callback
 */
function getUser(email, callback) {
    model
        .findOne({ where: { email }, raw: true })
        .then(user => {
            if (!user) {
                callback(Error('No user found!'), null);
            } else {
                callback(false, user);
            }
        })
        .catch(err => {
            console.log(err);
            callback({ error: true, message: 'Server error.' });
        });
}

function updatePassword(id, oldPassword, newPassword, callback) {
    console.log('-------------------------')

    model
        .findOne({ where: { id } })
        .then(oldUser => {
            console.log('found')
            bcrypt.compare(
                oldPassword,
                oldUser.dataValues.password,
                (err, match) => {
                    if (err) {
                        return callback(Error('Server error.'));
                    }
                    if (!match) {
                        return callback(Error('Incorrect password.'));
                    } else {
                        hashPassword(newPassword, function(err, hash) {
                            if (err) {
                                return callback(Error(err));
                            }

                            oldUser
                                .update({ password: hash })
                                .then(data => {
                                    callback(false);
                                })
                                .catch(err => {
                                    callback(Error(err));
                                });
                        });
                    }
                }
            );
        })
        .catch(err => {
            callback(Error(err));
        });
}
 
module.exports = { model, createUser, getUser, updatePassword };
