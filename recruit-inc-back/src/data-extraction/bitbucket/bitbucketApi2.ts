import fetch from "node-fetch";
const logger = require('../../logger.js');
const fs = require('fs');

export class BitbucketApi2 {

    public queryUserInfo(accessToken: string, user: string ) : string{
        logger.info({class: "bitbucketApi2", method: "queryData", action: "Querying bitbucket's api", params: {accessToken, user}}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
        return fetch(`https://api.bitbucket.org/2.0/users/${user}/repositories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(response => response.text())
            .then(body => {
                logger.info({class: "bitbucketApi2", method: "queryData", action: "Result from bitbucket's api", value: body}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                console.log("This is the body: ", body);

                var repoName = "";

                //This loop will iterate through each character in the GET response, find the string "slug" and return the repo name
                for (let outer in body){

                    //The outer iterator needed to be parsed as an int even though it is a number, typescript thinks it's a string
                    var iterator = parseInt(outer);
                    // slugFinder will hold only 4 characters
                    var slugFinder = body[iterator] + body[iterator + 1] + body[iterator + 2] + body[iterator + 3];

                    if (slugFinder == "slug"){
                        //Inner iterator will start at the beginning of the repo name, which is 8 characters away from the beginning of the word slug
                        var inner = iterator + 8;
                        //While loop will retrieve the repo name, one character at a time, until the closing "
                        while(body[inner] != '"'){
                            repoName += body[inner];
                            inner += 1;
                        }
                    }
                }

                console.log("Repo Name: " + repoName);

                fs.writeFile('bitbucketRepoList.json', body, function(err){
                    if (err) {
                       throw err;;
                   }
                });
                return body;
            })
            .catch(error => {
                logger.error({class: "bitbucketApi2", method: "queryData", action: "Error from bitbucket's api", value: error}, {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
                return error;
            });
    }
}
