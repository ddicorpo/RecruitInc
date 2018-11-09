'use strict';
//this script contains the logger configuration.
//It exports the created logger object to be used by other scripts


const logConfig = require('winston');
const fileSystem = require('fs');
const logDirectory = 'log';
const directoryExists = fileSystem.existsSync(logDirectory);

if(!directoryExists){
    fileSystem.mkdirSync(logDirectory);
}

const logger = logConfig.createLogger({
    //each transport is a different directory to display or store a log
    //log levels follows npm format (error, warn, info, verbose, debug, silly)
    transports: [
        // new (logConfig.transports.Console)({
        //     colorize: true,
        //     level: 'silly'
        // }),
        new (logConfig.transports.File)({
            filename: `${logDirectory}/error.json`,
            level: 'error'
        }),
        new (logConfig.transports.File)({
            filename: `${logDirectory}/warn.json`,
            level: 'warn'
        }),
        new (logConfig.transports.File)({
            filename: `${logDirectory}/info.json`,
            level: 'info'
        }),
        new (logConfig.transports.File)({
            filename: `${logDirectory}/verbose.json`,
            level: 'verbose'
        }),
        new (logConfig.transports.File)({
            filename: `${logDirectory}/debug.json`,
            level: 'debug'
        }),
        new (logConfig.transports.File)({
            filename: `${logDirectory}/silly.json`,
            level: 'silly'
        })
    ]
});

module.exports = logger;
