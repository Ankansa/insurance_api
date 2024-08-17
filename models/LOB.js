// models/LOB.js
const mongoose = require('mongoose');
const insurance_db = require('./dbconfig').insurance_dbCon

const lobSchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
},{
    strict: false,
    versionKey: false,
});

LOBModel = insurance_db.model('LOB', lobSchema, 'LOB');

module.exports = {LOBModel};