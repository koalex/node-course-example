/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

/*
 ================================
 ===        TEMPLATES         ===
 ================================
*/

'use strict';

const fs             = require('fs');
const config         = require('config');
const pug            = require('pug');
const path           = require('path');
const join           = path.join;
const extname        = path.extname;
const templatesRoot  = join(require('config').projectRoot, './client');
const CLS            = require('continuation-local-storage');

let assets, favicons;
try {
    assets    = JSON.parse(fs.readFileSync(join(config.publicRoot, './assets.json'),   'utf8'));
    favicons  = JSON.parse(fs.readFileSync(join(config.publicRoot, './favicons.json'), 'utf8'));
} catch (err) {
    console.error(err);
}

module.exports = async (ctx, next) => {
    if (__DEV__) {
        try {
            assets    = JSON.parse(fs.readFileSync(join(config.publicRoot, './assets.json'),   'utf8'));
            favicons  = JSON.parse(fs.readFileSync(join(config.publicRoot, './favicons.json'), 'utf8'));
        } catch (err) {
            console.error(err);
        }

        fs.watchFile(join(config.publicRoot, './assets.json'), (curr, prev) => {
            assets = JSON.parse(fs.readFileSync(join(config.publicRoot, './assets.json'),'utf8'));
        });
        fs.watchFile(join(config.publicRoot, './favicons.json'), (curr, prev) => {
            favicons = JSON.parse(fs.readFileSync(join(config.publicRoot, './favicons.json'),'utf8'));
        });
    }

    class Locals {

        constructor(locs) {
            this.userAgent  = ctx.userAgent;
            for (let key in locs) this[key] = locs[key];
        }
        get assets() {
            return assets; // assets manifest from webpack
        }
        get favicons() {
            return favicons; // assets manifest from webpack
        }
        get user() {
            return ctx.user; // passport sets this further
        }
        get pretty() {
            return false;
        }
        get debug() {
            return __DEBUG__;
        }
        get __DEV__() {
            return __DEV__;
        }

    }

    ctx.render = (templatePath, locals) => {

        locals = locals || {};

        let localsFull = new Locals(locals);
        let path2file  = join(templatesRoot, templatePath);

        if (extname(path2file) !== '.pug') path2file += '.pug';

        return (ctx.body = pug.renderFile(path2file, localsFull));

    };

    await next();
};