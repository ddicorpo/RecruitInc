// Warning: This code is temporary we will soon
// include TypeScript...
require('dotenv').load();
const express  = require('express');
const app = express();
const fetch = require('node-fetch');

// Default home page of the API 
app.get('/', (req, res) => {
  res.send("Hello from ExpressJS ")
});

// PORTS , we can setup in an env. variable
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port} `))

const accessToken = process.env.AccessToken;
const query = `
  query {
    user(login: ${process.env.GitUserName}) {
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
