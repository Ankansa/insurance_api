// models/Policy.js
const mongoose = require('mongoose');
const insurance_db = require('./dbconfig').insurance_dbCon


const policySchema = new mongoose.Schema({
    policyNumber: { type: String, required: true },
    policyStartDate: { type: Date, required: true },
    policyEndDate: { type: Date, required: true },
    categotyCollectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},{
    strict: false,
    versionKey: false,
});

PolicyModel = insurance_db.model('Policy', policySchema, 'Policy');
module.exports = {PolicyModel};