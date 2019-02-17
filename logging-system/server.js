var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(5656, function () {
    console.log("Listening on port 5656")
});

app.post('/', function(req, res){
    try{
        var myData = req.body;
        sendLog(myData);
    }catch(Exception){
        console.log(Exception)
    }
    res.status(200).send();
});


function sendLog(myData){

    const MongoClient = require('mongodb').MongoClient;
    const uri =  process.env.DB_URI;

    var formattedData =
    {
        message:myData.message,
        level: myData.level
    }
    console.log(formattedData)
    const client = new MongoClient(uri, { useNewUrlParser: true });
    try{
        client.connect(err => {

            client.db("logging-system").collection("logs").insertOne(formattedData, function(err, res){
                if(err){
                    console.log("can't insert in db")
                    console.log(err)
                }else{
                    console.log("Log inserted in database !!! ")
                }
            });
            client.close();
        });
    }
    catch(Exception){
        console.log("Problem while sending log...")
        console.log(Exception)
    }
    finally{
        client.close();
    }
}