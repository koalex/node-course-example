'use strict';

const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/user');

module.exports = new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    session: false
},
function (login, password, done) {

    let isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
.test(login);

    User.findOne({ [isEmail ? 'email' : 'login']: login }, function (err, user) {

        if (err) return done(err);

        if (!user) return done(null, false, { field: 'login', message: 'пользователь не найден' });

        if (!user.checkPassword(password)) {

            done(null, false, { field: 'password', message: 'неверный пароль' });
            return;
        }

        done(null, user)
    });
});

