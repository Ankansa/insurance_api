const mongoose = require('mongoose')
// const stage = process.env.NODE_ENV;


let insurance_UserDB;


insurance_UserDB = process.env.INSURANCE_DB

try {
    insurance_dbCon = mongoose.createConnection(insurance_UserDB, {
        // keepAlive: 1,
        useNewUrlParser: true,
        connectTimeoutMS: 4000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 60000,
        useUnifiedTopology: true,
        // useFindAndModify: false
    });
} catch (error) {
    console.log("Unable to connect to insurance_db: ", error)
}


module.exports = {
    
    insurance_dbCon
}