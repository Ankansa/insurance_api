// models/Agent.js
const mongoose = require('mongoose');
const insurance_db = require('./dbconfig').insurance_dbCon



// const Schema = mongoose.Schema;

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    }, {
    strict: false,
    versionKey: false,
});

const AgentModel = insurance_db.model('Agent', agentSchema, "Agent");


module.exports = {AgentModel};