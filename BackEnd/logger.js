'use strict';
//this script contains the logger configuration.
//It exports the created logger object to be used by other scripts


const winston = require('winston'); //library for the logger
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
//creates the logger
const logger = winston.createLogger({
    //each transport is a different directory to display or store a log
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info' //configured to info level of logging
        }),
        new (winston.transports.File)({
            filename: `${logDir}/results.log`,
            timestamp: tsFormat,
            level: env === 'development' ? 'debug' : 'info'
        })
    ]
});

module.exports = logger;
