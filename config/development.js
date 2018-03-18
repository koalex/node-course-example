'use strict';

global.__DEV__ = process.env.NODE_ENV === 'development';
const defer    = require('config/defer').deferConfig;

module.exports = {
    mongoose: {
        // uri: defer(cfg => { return `mongodb://defaultUser:AXmaHS@localhost:27017/${cfg.mongoose.dbName}`; }),
        uri: defer(cfg => { return `mongodb://localhost:27017/${cfg.mongoose.dbName}`; }),
    },
    crypto: {
        hash: {
            iterations: 1
        }
    }
};


