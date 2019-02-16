var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(5656, function () {
    console.log("Listening on port 5656")
});

app.post('/', function(req, res){
    var myData = JSON.stringify(req.body);   
    sendLog(myData);

    res.status(200).send(res);
});


function sendLog(myData){

    const MongoClient = require('mongodb').MongoClient;
    const uri = process.env.DB_URI;
    const client = new MongoClient(uri, { useNewUrlParser: true });
    
    try{
        client.connect(err => {
            const collection = client.db("logging-system").collection("logs");

            console.log(myData);
            collection.save(JSON.parse(myData));

            client.close();
        });
    }
    catch(Exception){
        console.log("Problem while sending log...")
    }
}