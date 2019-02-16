let express = require('express');
let app = express();

app.get('/', function (req, res){
    res.send('it works');
});

let server = app.listen(5656, function() {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Listening on port: " + port);
});