const mongoose = require("mongoose");
const { clusterUri, dbName } = require('../config/mongoDB');

const dbConnect = async () => {

    mongoose.connect(clusterUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: dbName,
    }).then(() => {
        console.log('Connected to the Database.');
    }).catch(err => {
        console.error(err)
    });
}

module.exports = {
    dbConnect
}