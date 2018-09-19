// Warning: This code is temporary we will soon
// include TypeScript...
require('dotenv').load();
const express  = require('express');
const app = express();
const fetch = require('node-fetch');

//include the following require, to enable the logger to function
var logger = require('./logger.js'); 


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
    .then(body => (console.log(body),
    logger.info(body)))
      .catch(error => (console.error(error),
        logger.error(error)));
