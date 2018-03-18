'use strict';

const mongoose  = require('../../../libs/mongoose');

const blackTokenSchema = new mongoose.Schema({
        token: { type: String }
    },
    { versionKey: false });

blackTokenSchema.path('token').validate(function (v) {
    if (!v || String(v).trim() === '') this.invalidate('token', 'токен отсутствует');
}, null);

module.exports = mongoose.model('BlackToken', blackTokenSchema);

