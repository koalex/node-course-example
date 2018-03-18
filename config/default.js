'use strict';

const fs   = require('fs');
const path = require('path');
const join = path.join;

module.exports =  {
             port: process.env.PORT ? process.env.PORT : 3000,
      projectRoot: process.cwd(),
       publicRoot: join(process.cwd(), './public'),
           secret: 'kawabanga',
    mongoose: {
        dbName: 'chatdb',

        // [poolSize,ssl,sslValidate,sslCA,sslCert,sslKey,sslPass,sslCRL,autoReconnect,noDelay,keepAlive,connectTimeoutMS,family,socketTimeoutMS,reconnectTries,reconnectInterval,ha,haInterval,replicaSet,secondaryAcceptableLatencyMS,acceptableLatencyMS,connectWithNoPrimary,authSource,w,wtimeout,j,forceServerObjectId,serializeFunctions,ignoreUndefined,raw,bufferMaxEntries,readPreference,pkFactory,promiseLibrary,readConcern,maxStalenessSeconds,loggerLevel,logger,promoteValues,promoteBuffers,promoteLongs,domainsEnabled,keepAliveInitialDelay,checkServerIdentity,validateOptions,appname,auth]
        options: {
            useMongoClient: true,
            keepAlive: 1,
            poolSize: 5,
            connectTimeoutMS: __DEV__ ? 10000 : 0,
            socketTimeoutMS: __DEV__ ? 10000 : 0,
            promiseLibrary: global.Promise
        }
    },
    crypto: {
        hash: {
            length: 128
        }
    },

    copyright: 'Konstantin Aleksandrov'
};


