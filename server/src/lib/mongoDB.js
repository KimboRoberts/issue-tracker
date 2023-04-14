const mongoose = require("mongoose");
const { logger } = require('../log');
require("dotenv").config();

const dbConnect = async () => {

    mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.DB_NAME,
    }).then(() => {
        logger.info(`Successfully connected to database: [${process.env.DB_NAME}]`)
    }).catch(err => {
        console.error(err)
    });
}

module.exports = {
    dbConnect
}