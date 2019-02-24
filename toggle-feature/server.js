const express = require('express');
const app = express();
const port = 3547;

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/frontend', (req, res) => res.send('Front-end features!'));
app.get('/backend', (req, res) => res.send('Back-end features'));

app.listen(port, () => console.log(`toggle-feature is listening on port ${port}!`));