const winston = require('winston'); 

const { splat, combine, timestamp, printf } = winston.format;

// meta param is ensured by splat()
const customFormat = printf(({ timestamp, level, message, meta }) => {
    return `${timestamp} ${level.toUpperCase()}\t${message} ${meta ? 'meta: ' + JSON.stringify(meta) : ''}`;
});

const combinedFormat = combine(timestamp(), splat(), customFormat);

const logger = winston.createLogger({
    format: combinedFormat,
    transports: [
      new winston.transports.Console(),
    ]
});

module.exports = {
    logger,
    combinedFormat
};