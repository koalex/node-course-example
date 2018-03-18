'use strict';

const serve  = require('koa-static');
const config = require('config');

module.exports = async (ctx, next) => {
    let staticPath = config.publicRoot;

    return serve(staticPath, {
        maxage : __DEV__ ? 0 : 86400000*30,
        gzip: true,
        usePrecompiledGzip: true
    })(ctx, next);
};