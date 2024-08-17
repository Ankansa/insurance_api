// models/Carrier.js
const mongoose = require('mongoose');
const insurance_db = require('./dbconfig').insurance_dbCon


const carrierSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
},{
    strict: false,
    versionKey: false,
});

CarrierModel = insurance_db.model('Carrier', carrierSchema, 'Carrier');

module.exports = {CarrierModel};