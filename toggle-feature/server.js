const express = require('express');
const app = express();
const cors = require('cors');
const port = 3547;

const backendFeature = require('./features/backendFeature');
const backendCriteria = require('./criteria/backendCriteria');

const frontendFeature = require('./features/frontendFeature');
const frontendCriteria = require('./criteria/frontendCriteria');

app.use(cors());

app.get('/', (req, res) => res.send('Navigate to /frontend{or backend}/criteria{or feature}'));

app.get('/frontend/criteria', function(req, res){
    let criteria = new frontendCriteria();
    res.send(criteria.getFrontendCriteria());
});

app.get('/frontend/feature', function(req, res){
    let features = new frontendFeature();
    res.send(features.getFrontendFeature());
});

app.get('/backend/criteria', function(req, res){
    let criteria = new backendCriteria();
    res.send(criteria.getBackendCriteria());
});

app.get('/backend/feature', function(req, res){
    let features = new backendFeature();
    res.send(features.getBackendFeature());
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`)
});