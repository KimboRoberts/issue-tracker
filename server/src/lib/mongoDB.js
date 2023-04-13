const mongoose = require("mongoose");
const { clusterUri, dbName } = require('../config/mongoDB');
const { logger } = require('../log');

const dbConnect = async () => {

    mongoose.connect(clusterUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: dbName,
    }).then(() => {
        logger.info(`Successfully connected to database: [${dbName}]`)
    }).catch(err => {
        console.error(err)
    });
}

module.exports = {
    dbConnect
}