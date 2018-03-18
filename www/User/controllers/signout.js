'use strict';

const BlackList = require('../models/blacktokens');

module.exports = async ctx => {
	let token = ctx.request.body.access_token || ctx.query.access_token || ctx.headers['x-access-token'] || ctx.cookies.get('x-access-token');

	let blackToken = new BlackList({ token: token });

	await blackToken.save();

	ctx.state.user = null;

	ctx.status = 204;
};