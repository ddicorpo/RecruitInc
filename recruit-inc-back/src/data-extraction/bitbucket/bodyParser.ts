export default class bodyParser {

    public getRepoName(body: string[]) : string{
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

        return repoName;
    }

}