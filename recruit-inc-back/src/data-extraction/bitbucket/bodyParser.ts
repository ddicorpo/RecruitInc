export default class bodyParser {

    public getAllRepoName(body: string[]) : string[]{
        let repoName = "";
        let allNames: string[] = new Array(0);
        let slugFinder: string;
        let iterator: number;
        let inner: number;

        console.log("\n\n" + body);
        //This loop will iterate through each character in the GET response, find the string "slug" and return the repo name
        for (let outer in body){
            //The outer iterator needed to be parsed as an int even though it is a number, typescript thinks it's a string
            iterator = parseInt(outer);
            // slugFinder will hold only 4 characters
            slugFinder = body[iterator] + body[iterator + 1] + body[iterator + 2] + body[iterator + 3];

            if (slugFinder == "slug"){
                //Inner iterator will start at the beginning of the repo name, which is 8 characters away from the beginning of the word slug
                inner = iterator + 8;
                //While loop will retrieve the repo name, one character at a time, until the closing "
                while(body[inner] != '"') {
                    repoName += body[inner];
                    inner += 1;
                }

                allNames.push(repoName);
                repoName = "";
            }
        }

        return allNames;
    }

    public getAllCommits(body: string[], username: string) : string[]{
        let hashName = "";
        let allCommitNames: string[] = new Array(0);
        let iterator: number = 0;
        let inner: number;
        let hashFinder: string;
        let usernameLength: number = username.length;
        let usernameFinder: string = "";
        let counter: number = 0;

        for (let outer in body) {
            if (iterator <= parseInt(outer)) {
                iterator = parseInt(outer);

                while (counter < usernameLength) {
                    usernameFinder += body[iterator + counter];
                    counter += 1;
                }

                if (usernameFinder.match(username)) {
                    while (true){
                        hashFinder = body[iterator] + body[iterator + 1] + body[iterator + 2] + body[iterator + 3] + body[iterator + 4];

                        if (hashFinder == "\"hash") {
                            inner = iterator + 10;

                            while (body[inner + 1] != '"') {
                                hashName += body[inner];
                                inner += 1;
                            }

                            console.log("this is the commit id: " + hashName);

                            allCommitNames.push(hashName);
                            hashName = "";
                            break;
                        }
                        else{
                            iterator += 1;
                        }
                    }
                }
                else {
                    counter = 0;
                }
            }
        }
        return allCommitNames;
    }

}