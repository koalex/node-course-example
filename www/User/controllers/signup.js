'use strict';

const uuid       = require('uuid/v4');
const disposable = require('disposable-email');
const User       = require('../models/user');


module.exports = async ctx => {
	await new Promise(resolve => { setTimeout(resolve, 1000) });

	if ('string' == typeof ctx.request.body.email && !disposable.validate(ctx.request.body.email)) {
		return ctx.throw(400, { message: {
			field: 'email',
			message: 'email запрещен'
		} });
	}

	let emailExist = await User.findOne({ email: ctx.request.body.email }).lean().exec();
	let loginExist = await User.findOne({ login: ctx.request.body.login }).lean().exec();

	if (!!emailExist || !!loginExist) {
		let message = [];

		if (!!emailExist) {
			message.push({
				field: 'email',
				message: 'email уже занят'
			});
		}
		if (!!loginExist) {
			message.push({
				field: 'login',
				message: 'логин уже занят'
			});
		}

		return ctx.throw(400, { message });
	}

	let user = new User(ctx.request.body);
		user.last_ip_address = ctx.request.ip;
		user.token_uuid = uuid();

	await user.save();

	ctx.status = 201;
};