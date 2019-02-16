let express = require('express');
let app = express();

app.get('/', function (req, res){
    res.send('Logging System');
});

app.post('/', function (req, res) {
    res.send('POST works');
    console.log(req.method + " --- " + req.originalUrl);
    console.log(req.params);
})

let server = app.listen(5656, function() {
    let port = server.address().port;

    console.log("Listening on port: " + port);
});