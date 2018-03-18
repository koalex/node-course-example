/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

/*
 ================================
 ===        USER MODEL        ===
 ================================
*/

'use strict';

const fs          = require('fs');
const crypto      = require('crypto');
const config      = require('config');
const moment      = require('moment');
const validate    = require('mongoose-validator');
const validatorjs = require('validator');
const mongoose    = require('../../../libs/mongoose');


let locales = ['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'cs-CZ', 'da-DK', 'de-DE', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sr-RS', 'sr-RS@latin', 'tr-TR', 'uk-UA'];
const loginValidator = [
    validate({
        validator: function (v) {
            return v.length <= 30;
        },
        message: 'логин должен содержать максимум 30 символов'
    }),
    validate({
        validator: function (v) {
            return v.length >= 6;
        },
        message: 'логин должен содержать минимум 6 символов'
    }),
    validate({
        validator: function (v) {
            return (locales.some(locale => validatorjs.isAlpha(v, locale)) || /[0-9]/.test(v));
        },
        message: 'логин должен содержать букву или цифру'
    })
];

const nameValidator = [
    validate({
        validator: function (v) {
            return v.length <= 60;
        },
        message: 'имя слишком длинное'
    })
];

const surnameValidator = [
    validate({
        validator: function (v) {
            return v.length <= 70;
        },
        message: 'фамилия слишком длинная'
    })
];


const emailValidator = [
    validate({
        validator: function (v) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)
        },
        passIfEmpty: false,
        message: 'неверно указан email'
    })
];


const isLengthValidator = (min, max, message = 'ошибка сервера') => [
    validate({
        validator: function (v) {
            return v.length <= max && v.length >= min;
        },
        message: message
    })
];

const dateRangeValidator = (min, max, message = 'ошибка сервера') => [
    validate({
        validator: function (v) {
            let val = v, _min = min, _max = max;
            if (v.getTime) val = v.getTime();
            if ('function' == typeof min) _min = min();
            if ('function' == typeof max) _max = max();

            return val <= _max && val >= _min;
        },
        message: message
    })
];


const isObjectId = [
    validate({
        validator: 'isMongoId',
        message: 'ошибка сервера'
    })
];

const isUUID = [
    validate({
        validator: 'isUUID',
        passIfEmpty: true,
        message: 'ошибка сервера'
    })
];

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'укажите имя'], trim: true, validate: nameValidator },
    surname: { type: String, trim: true, required: [true, 'укажите фамилию'], validate: surnameValidator },
    login: { type: String, unique: true, trim: true, validate: loginValidator },
    email: {
        type: String,
        unique: true,
        required: [true, 'укажите email'],
        lowercase: true,
        trim: true,
        validate: emailValidator
    },
    password_reset_token: { type: String, validate: isLengthValidator(3, 300) },
    password_reset_expiration: { type: Date },
    token_uuid: { type: String, validate: isUUID },
    password_hash: { type: String, required: [true, 'ошибка сервера'], validate: isLengthValidator(10, 800) },
    salt: { type: String, validate: isLengthValidator(10, 800) },
    created_at: { type: Date, default: Date.now, validate: dateRangeValidator((new Date('2018-01-01')).getTime(), Date.now) },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', validate: isObjectId },
    last_activity: { type: Date, default: Date.now, validate: dateRangeValidator((new Date('2018-01-01')).getTime(), Date.now) },
    updated_at: { type: Date, required: [true, 'ошибка сервера'], default: Date.now, validate: dateRangeValidator((new Date('2018-01-01')).getTime(), Date.now) },
    last_updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    last_ip_address: { type: String, validate: isLengthValidator(1, 40) }
    // for transactions implementation
    // updated: { type: mongoose.Schema.Types.Mixed, default: null },
    // tx: { type: mongoose.Schema.Types.ObjectId, default: null }
},
{
    versionKey: false,
    autoIndex: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    id: false,
    minimize: true,
    // safe: { j: 1, w: 2, wtimeout: 10000 }, // only if replica
    retainKeyOrder: true
});


userSchema.virtual('passwordConfirmation')
    .set(function (v) { this._passwordConfirmation = v; })
    .get(function ()  { return this._passwordConfirmation; });

userSchema.virtual('password')
    .set(function (password) {
        if (!password || String(password).trim() === '') {
            this.invalidate('password', 'укажите пароль');
            return;
        }
        this._password     = password;
        this.salt          = crypto.randomBytes(config.crypto.hash.length).toString('base64');
        this.password_hash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length, 'sha512');
    })
    .get(function () { return this._password; });

userSchema.methods.checkPassword = function (password) {
    if (!password) return false;
    if (!this.password_hash) return false;
    return String(crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length, 'sha512')) === this.password_hash;
};

userSchema.path('password_hash').validate(function (v) {
    if (this._password || this._passwordConfirmation) {
        if (this._password.length < 6) this.invalidate('password', 'пароль должен содержать минимум 6 символов');
        if (this._password.length > 128) this.invalidate('password', 'пароль должен содержать максимум 128 символов');
        if (!/([0-9]{1,})/.test(this._password)) this.invalidate('password', 'пароль должен содержать минимум 1 цифру');
        if (!/[А-Яа-яA-Za-z]/.test(v)) this.invalidate('password', 'пароль должен содержать минимум 1 букву');
        if (this._password !== this._passwordConfirmation) this.invalidate('password', 'пароли не совпадают');
    }
}, null);


userSchema.methods.toJSON = function (opts) {
    let data = this.toObject(opts);
    // delete data.push_id;
    delete data.updated;
    delete data.tx;
    delete data.password_hash;
    delete data.salt;
    delete data.email_confirmation_token;
    delete data.password_reset_token;
    delete data.password_reset_expiration;
    delete data.token_uuid;

    return data;
};

module.exports = mongoose.model('User', userSchema);
