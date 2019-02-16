var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(5656, function () {
    console.log("Listening on port 5656")
});

app.post('/', function(req, res){
    var myData = req.body;
    console.log(myData);
    res.status(200).send();
});

