var logger = require('./logger.js');

logger.error('testing error', {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
logger.warn('testing warn', {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
logger.info('testing info', {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
logger.verbose('testing verbose', {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
logger.debug('testing debug', {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
logger.silly('testing silly', {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});