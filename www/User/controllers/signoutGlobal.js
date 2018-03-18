'use strict';

const BlackList = require('../models/blacktokens');
const User      = require('../models/user');
const Socket    = require('../../../libs/socket');
const uuid      = require('uuid/v4');

module.exports = async ctx => {
	let token = ctx.request.body.access_token || ctx.query.access_token || ctx.headers['x-access-token'] || this.cookies.get('x-access-token');

	let blackToken = new BlackList({ token: token });

	await blackToken.save();

	let user = await User.findOne({ _id: ctx.state.user._id });

	user.token_uuid = uuid();

	await user.save();

	let userId = ctx.state.user._id;
	Socket.emitter.of('/app').to('chat').emit('signout-global', {_id: userId});

	ctx.state.user = null;

	ctx.status = 204;
};
