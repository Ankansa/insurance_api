// models/Account.js

const mongoose = require('mongoose');
const insurance_db = require('./dbconfig').insurance_dbCon




const accountSchema = new mongoose.Schema({
    accountName: { type: String, required: true },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }, {
    strict: false,
    versionKey: false,
});

const AccountModel = insurance_db.model('Account', accountSchema, "Account");


module.exports = {AccountModel};