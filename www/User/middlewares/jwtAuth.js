/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

/*
 ==================================
 ===   Access Control via JWT   ===
 ==================================
 */

'use strict';

const config      = require('config');
const passport    = require('koa-passport');
const jwt         = require('jsonwebtoken');
const BlackList   = require('../models/blacktokens');

passport.use('jwt', require('../strategies/jwt'));

module.exports = async (ctx, next) => {
    await passport.authenticate('jwt', async (err, user, info, status) => {

        if (err) return ctx.throw(err);

        if (user && !(info && info.name && info.name === 'TokenExpiredError')) {
            let token  = ctx.request.body.access_token || ctx.query.access_token || ctx.headers['x-access-token'] || ctx.cookies.get('x-access-token');

            let denied = await BlackList.findOne({ token }).lean().exec();

            if (!denied && !(jwt.verify(token, config.secret).token_uuid !== user.token_uuid)) {
                user.last_activity    = Date.now();
                user.last_ip_address  = ctx.request.ip;

                await user.save();

                ctx.state.user  = user;
                ctx.state.token = token;
            } else {
                return ctx.throw(401);
            }
        } else {
            return ctx.throw(401);
        }

        await next();

    })(ctx, next);
};