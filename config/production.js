'use strict';

const defer = require('config/defer').deferConfig;

module.exports =  {
    mongoose: {
        // uri: defer(cfg => { return `mongodb://USER_NAME:PASSWORD@localhost:27017/${cfg.mongoose.dbName}`; }),
        uri: defer(cfg => { return `mongodb://localhost:27017/${cfg.mongoose.dbName}`; }),
    },
    crypto: {
        hash: {
            iterations: 12000
        }
    }
};


