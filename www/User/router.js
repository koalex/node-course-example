/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

/*
 ================================
 ===        USER ROUTER       ===
 ================================
*/

'use strict';

const Router = require('koa-router');
const router = new Router();
const ApiV1  = new Router({ prefix: '/api/v1' });

const authMW         = require('./middlewares/jwtAuth');
const signin         = require('./controllers/signin');
const signup         = require('./controllers/signup');
const signout        = require('./controllers/signout');
const signoutGlobal  = require('./controllers/signoutGlobal');

ApiV1.post('/signin',    signin);
ApiV1.post('/signup',    signup);
ApiV1.post('/signout', authMW, signout);
ApiV1.post('/signout-global', authMW, signoutGlobal);

ApiV1.get('/me', authMW, async ctx => { ctx.body = ctx.state.user; });

router.use(ApiV1.routes());

module.exports = router;
