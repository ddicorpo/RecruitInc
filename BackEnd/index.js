// Warning: This code is temporary we will soon
// include TypeScript...
'use strict';
require('dotenv').load();
const express  = require('express');
const app = express();
const fetch = require('node-fetch');
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
            level: 'info'
        }),
        new (winston.transports.File)({
            filename: `${logDir}/results.log`,
            timestamp: tsFormat,
            level: env === 'development' ? 'debug' : 'info'
        })
    ]
});
//simple test to check for functionality of the logger
logger.info('Hello world');
logger.warn('Warning message');
logger.debug('Debugging info');
// Allowing Communication between our nodes...
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Default home page of the API 
app.get('/', (req, res) => {
  res.json("Hello from ExpressJS ")
});

// Let's define an API function
app.get('/api/hi', (req, res) => {
  var obj = [{name:'Hi'},{name:'Bonjour'},{name:'Hello'}]
  res.send(obj);
});


// PORTS , we can setup in an env. variable
const port = process.env.PORT || 6969
app.listen(port, () => console.log(`listening on port ${port} `))


const accessToken = process.env.AccessToken;
const query = `
  query {
    user(login: "${process.env.GitUserName}") {
      repositories(first: 10, isFork: false) {
        nodes {
          name
          url
        }
      }
    }
  }`;

fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({query}),
    headers: {
        'Authorization': `Bearer ${accessToken}`,
    },
}).then(res => res.text())
    .then(body => console.log(body))
    .catch(error => console.error(error));
