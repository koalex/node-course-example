/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/
 /* 
   ================================
   ===       MODULE NAME       ====
   ================================ 
*/

'use strict';

const config              = require('config');
const User                = require('../models/user');
const JwtStrategy         = require('passport-jwt').Strategy;
const opts                = {};
      opts.secretOrKey    = config.secret;
      opts.ignoreExpiration = false;
      opts.jwtFromRequest = req => {
          let token = req.body.access_token || req.query.access_token || req.headers['x-access-token'] || req.cookies.get('x-access-token');
          return token;
      };

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.user_id }, (err, user) => {
        if (err) return done(err, false);

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});
