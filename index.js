require('dotenv').load();

const fetch = require('node-fetch');

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
