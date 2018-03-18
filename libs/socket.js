/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

/*
 ================================
 ===           SOCKET         ===
 ================================
 */

'use strict';

const config 		 = require('config');
const fs             = require('fs');
const path           = require('path');
const glob           = require('glob');
const socketIO 		 = require('socket.io');
const socketEmitter  = require('socket.io-emitter');
const socketIORedis  = require('socket.io-redis');
const redisClient 	 = require('redis').createClient({ host: 'localhost', port: 6379 });
const Cookies 		 = require('cookies');
const User           = require('../www/User/models/user');
const jwt            = require('jsonwebtoken');
const BlackTokens    = require('../www/User/models/blacktokens');

const socketPrefix   = 'S_';


function tokenFromSocket (socket) {
    let handshakeData = socket.request; // http request
    const cookies     = new Cookies(handshakeData, {}, config.secret);

    let token;

    if (handshakeData.query && handshakeData.query.access_token) {
        token = handshakeData.query.access_token;
    } else if (handshakeData._query && handshakeData._query.access_token) {
        token = handshakeData._query.access_token;
    } else if (handshakeData.headers && handshakeData.headers['x-access-token']) {
        token = handshakeData.headers['x-access-token'];
    } else if (cookies.get('x-access-token')) {
        token = cookies.get('x-access-token');
    }

    return token;
}


function Socket (server) {
    let io = socketIO(server, { transports: ['websocket'] });
    io.adapter(socketIORedis({ host: 'localhost', port: 6379 })); // TODO: not working wiwth socket.io v2

    let appNsp = io.of('/app');

    appNsp.use((socket, next) => {

        let token = tokenFromSocket(socket);

        if (!token || token === 'null' || token === 'undefined' || ~token.indexOf('\0')) {
            return next({ status: 401, message: 'не авторизован' });
        }

        if (!(!token || 'null' === token || 'undefined' === token)) {
            // FIXME: проверить на срок действия токена, passport + socket req ?
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    next(err);
                } else {
                    (async () => {
                        let denied = await BlackTokens.findOne({ token: token }).lean().exec();

                        let user = await User.findOne({ _id: decoded.user_id });

                        if (denied || !user || (decoded.token_uuid !== user.token_uuid)) {
                            return await next(new Error({ status: 401, message: 'не авторизован' }));
                        }

                        user.last_activity   = Date.now();
                        user.last_ip_address = socket.request.ip;

                        await user.save();

                        socket.user  = user;
                        socket.token = token;

                        next();

                    })();
                }
            });


        } else {
            next();
        }
    });

    appNsp.on('connection', socket => {

        let token = tokenFromSocket(socket);

        redisClient.sadd([ socketPrefix + String(socket.user._id), socket.id ]);
        redisClient.sadd([ socketPrefix + token, socket.id ]);

        socket.join(String(socket.user._id));
        socket.join('chat');

        socket.on('disconnect', () => {
            console.log('disconnect');
            (async () => {
                try {
                    if (socket.user && socket.user._id) {
                        redisClient.srem([ socketPrefix + String(socket.user._id), socket.id ]);
                        redisClient.srem([ socketPrefix + token, socket.id ]);
                        // redisClient.del(socketPrefix + String(socket.user._id)); // REMOVE ALL
                        // redisClient.del(socketPrefix + token);                   // REMOVE ALL
                    }
                } catch (err) {
                    console.error('session clear error', err);
                }
            })();

        });
    });

    return io;
}

// ALL USER IDS : Socket.socket_ids(token).then(ids...)
Object.defineProperty(Socket, 'socket_ids', {
    writable: false,
    configurable: false,
    value: function (token) {
        let userId = jwt.verify(token, config.secret)._id;
        return new Promise((resolve, reject) => {
            redisClient.smembers( socketPrefix + String(userId), (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
});

// USER TOKEN IDS (SESSION IDS) : Socket.session_ids(token).then(ids...)
Object.defineProperty(Socket, 'session_ids', {
    writable: false,
    configurable: false,
    value: function (token) {
        return new Promise((resolve, reject) => {
            redisClient.smembers( socketPrefix + token, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
});

Socket.emitter = socketEmitter(redisClient);
Socket.emitter.redis.on('error', err => { console.error(err); });


/*          https://github.com/socketio/socket.io-emitter
 Socket.emitter.emit('broadcast', ...);

 // sending to all clients in 'game' room
 Socket.emitter.to('game').emit('new-game', ... );

 // sending to individual socketid (private message)
 Socket.emitter.to(<socketid>).emit('private', ... );

 let nsp = Socket.emitter.of('/admin');

 // sending to all clients in 'admin' namespace
 nsp.emit('namespace', ...);

 // sending to all clients in 'admin' namespace and in 'notifications' room
 nsp.to('notifications').emit('namespace',  ... );

 */


module.exports = Socket;
