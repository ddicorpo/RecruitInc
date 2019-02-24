const express = require('express');
const app = express();
const port = 3547;

const backendFeatures = require('./features/backendFeature');

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/frontend', (req, res) => res.send('Front-end features!'));

app.get('/backend', function(req, res){
    let features = new backendFeatures();
    res.send(features.getBackendFeature());
});

app.listen(port, () => console.log(`toggle-feature is listening on port ${port}!`));