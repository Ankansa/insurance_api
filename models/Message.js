// models/Message.js
const mongoose = require('mongoose');
const insurance_db = require('./dbconfig').insurance_dbCon



const messageSchema = new mongoose.Schema({
    message: String,
    datetime: Date,
},{
    strict: false,
    versionKey: false,
});

MessageModel = insurance_db.model('Message', messageSchema, 'Message');
module.exports = {MessageModel};