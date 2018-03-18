'use strict';

const config    = require('config');
const jwt       = require('jsonwebtoken');
const passport  = require('koa-passport');
// const User      = require('../models/user');

passport.use('local', require('../strategies/local'));

module.exports = async ctx => {
	await new Promise(resolve => { setTimeout(resolve, 1000) }); // Anti-brutforce secure

	await passport.authenticate('local', async (err, user, info, status) => {

		if (err) ctx.throw(err);

		if (!user) return ctx.throw(400, info ? (info.field && !Array.isArray(info)) ? { message: [info] } : info.message ? info.message: null : null);

		ctx.state.user = user;

		let token = jwt.sign({ user_id: user._id, token_uuid: user.token_uuid }, config.secret, { expiresIn: '30 days' });

		user.last_activity   = Date.now();
		user.last_ip_address = ctx.request.ip;

		await user.save();

		ctx.type = 'json';

		ctx.body = { access_token: token };

	})(ctx);
};