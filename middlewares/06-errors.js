/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

/*
 ================================
 ===   GLOBAL ERR HANDLER     ===
 ================================
 */

'use strict';

const normalize = require('path').normalize;

function validationErr (err) {
    let msgs = [];

    for (let k in err.errors) {
        let msg = {
            field: (err.errors[k].properties && err.errors[k].properties.path) ? err.errors[k].properties.path : k,
            message: (err.errors[k].properties && err.errors[k].properties.message) ? err.errors[k].properties.message : err.errors[k].message ? err.errors[k].message :  err.errors[k]
        };

        if (!Array.isArray(msg.message) && ~msg.message.indexOf('unique')) msg.message = 'значение не уникально';

        msgs.push(msg);
    }

    return (msgs.length === 1 ? msgs[0] : msgs);
}

module.exports = async (ctx, next) => {

    try {
        await next();

        if (ctx.response && ctx.response.status && ctx.response.status == 404 && !~ctx.request.url.indexOf('hot-update.json')) {
            ctx.throw(404);
        }
    } catch (err) {

        if (__DEV__) console.error(err);

        if (err.errorType) { // Browser error

            let report = {
                status: err.status,
                agent: err.agent,
                url: err.url,
                file: err.file,
                line: err.line,
                column: err.column,
                stack: err.stack,
                errorType: err.errorType,
                message: err.message,
                originalMessage: err.originalMessage,
                referer: ctx.get('referer'),
                cookie: ctx.get('cookie')
            };

            ctx.log.error(report);

        } else {
            let report = {
                status: err.status,
                message: err.message,
                stack: err.stack,
                url: ctx.request.url,
                referer: ctx.get('referer'),
                cookie: ctx.get('cookie')
            };

            if (!err.expose) report.requestVerbose = ctx.request; // dev error

            ctx.log.error(report);
        }

        let preferredType = ctx.accepts('html', 'json');
        let url           = normalize(ctx.request.url);

        if (url.startsWith('/api')) preferredType = 'json';


        let message;

        if (Array.isArray(err.message)) message = 'Bad request'; // TODO: MONGODB NATIVE VALIDATOR

        if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
            message = validationErr(err, Object.keys(err.errors), ctx)
        } else if (err.message == 'Missing credentials') {
            message = 'Missing credentials'
        } else if (err.name === 'AccessControlError') {
            message = 'Bad request'
        } else {
            message = err.message;
        }

        ctx.status = err.name === 'ValidationError' || err.name === 'ValidatorError' ? 400 : err.status ? err.status : err.statusCode ? err.statusCode : 500;


        if (!__DEV__ && ctx.status >= 500) {
            ctx.status = 500;
            message = 'Server error';
        }

        let response;

        if (Array.isArray(message)) {
            response = message;
        } else if (message.message && !Array.isArray(message.message)) {
            response = message;
        } else {
            response = { message }
        }

        if (preferredType === 'json') {
            if (err.code === 11000) err.status = 409;

            ctx.body = response;

            if (err.description) ctx.body.description = err.description;
        } else {
            ctx.set('X-Content-Type-Options', 'nosniff');

            ctx.status = err.name === 'ValidationError' || err.name === 'ValidatorError' ? 400 : err.status ? err.status : err.statusCode ? err.statusCode : 500;

            return ctx.render('error', {
                status: ctx.status,
                message,
                GO_2_HOME_PAGE: 'на главную страницу'
            });
        }

    }

};
