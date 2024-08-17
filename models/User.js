// models/User.js
const mongoose = require('mongoose');
const insurance_db = require('./dbconfig').insurance_dbCon


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String},
    phoneNumber: { type: String, required: true },
    state: { type: String},
    zipCode: { type: String},
    email: { type: String, required: true },
    gender: { type: String },
    userType: { type: String, required: true },
},{
    strict: false,
    versionKey: false,
});



UserModel = insurance_db.model('User', userSchema, 'User');
module.exports = {UserModel};