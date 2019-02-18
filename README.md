
# RecruitInc


## How install the Project with JetBrain IntelliJ ?

### Initialize Project
- Download and install intellij Ultimate
- Import or Create a project from the git folder

### Debug Configuration for back-end

- Install `nodejs` plugin is they are not installed
- Choose **add configuration** in **Run/Debug Configurations** panel
- In the configuration tab, set the `Node Interpreter:` to `usr/local/bin/node`
- In the configuration tab, set the  `Node parameter` to `--inspect-brk`
- In the configuration tab, set the `working directory:` to `YOUR_PATH.../recruit-inc-back`
- In the configuration tab, set the `JavaScript File:` to `dist/server.js`
- Give a name to the configuration and save.
- You should be able to debug from normal runtime (not from a test)

## How to start the project?

### Write `.env` file 

You need to write one `.env` in the recruit-inc-back
It needs to have the same variable as `recruit-inc-back/.env.example`


You need to write one `.env` in the recruit-inc-front
It needs to have the same variables as `recruit-inc-front/.env.example`


### Launch Containers

Back-End Docker Commands:
- docker login [...]
- cd recruit-inc-back
- docker build -t $USER/node-app .
- docker run -p 6969:6969 winterhart/node-app .

Front-End Docker Commands:
- docker login [...]
- cd recruit-inc-front
- docker build -t $USER/node-app-front .
- docker run -p 3000:3000 winterhart/node-app-front .




## API Endpoints

#### Back-end calls

- GET: http://localhost:6969/api/github/applicant/{accessToken}/{userName}
- GET: http://localhost:6969/api/github/applicant/admin



## How to run the project from terminal ?
- Open Two terminal windows 

### Start the Back-End Node 
 - Create your `.env` file based on `.env.example`
 - Set the `NODE_ENV` variable to `dev`
 - The back-end is inspired from the boiler plate: https://github.com/priyesh18/typescript-node-api
 - Navigate to the folder `recruit-inc-back`
 - You always need to install the node_modules folder
 run:  `npm install`
 - You can run the project using terminal with: `npm run dev`
 - You should receive a message: `listening on port 6969`
 - You can check the result at: **http://localhost:6969/api/hi**
 
### Start the Front-End Node
 - Navigate to the folder `recruit-inc-front`
 - You always need to install the node_modules folder
 run:  `npm install`
 - You can run the project using terminal with: `npm run dev`
 - You can build the project with `npm run build`
 - You should receive a message: `You can now view recruit-inc-front in the browser.`
 - You can check the result at: **http://localhost:3000/**

 
### Communication Between NodeJS application
You can try the system by sending a message to the Back-End from the Front-End
- Back-End node has a function called: http://localhost:6969/api/hi
- Front-End will attempt to get the data returned by the get at: http://localhost:6969/api/hi
- In the Front-End, application you wil be able to see a object:

`state (3) [{…}, {…}, {…}] 0: {name: "Hi"} 1: {name: "Bonjour"} 2: {name: "Hello"} `

These data are from the other node. There are contained in `./src/fakeStorage.json`


### Start the application in **demo** mode
- You can demo the front-end or the back-end or both
- Open a terminal and navigate to `recruit-inc-front` or `recruit-inc-back`
- Run the command `npm run demo` , a localtunel url address usually `https://recruit-back.localtunnel.me/` or `https://recruit-front.localtunnel.me/` will be available on the internet
- This is a tunnel from the internet to your computer, don't forget to close it when your done, your terminal needs to run

## Deployement Instructions

You need to deploy the back-end node and the front-end node. You also need to set two `.env`
files (one for each node).

### Back-End Node Deployement
- Make sure to set the `NODE_END` variable to `production` in `.env`
- Set all `token` and `credential` 
- Add Front-End domain name to `DOMAIN_FRONT_END` variable in `.env` folder
- Run the command `npm run prod`

## Run Tests

### Run Unit Test (Back-End)
 - The test are written in `test` folder
 - You can run all unit test by entering the command `npm run test`
 - You should receive results in your terminal

### Run Unit Test Coverage (Back-End)
 - You can get a unit test coverage report using the script writtien in `pakage.json`
 - Run the command: `npm run testWithCoverage` to run the test coverage
 - The command will create a folder:  `coverage` with all results inside
 - Sample Result:
 
![alt text](https://github.com/ddicorpo/RecruitInc/blob/master/CourseAdmin/assets/SampleTestCoverage.png "Sample Test Coverage")

(attempt to use/install Jest + enzyme + webpack + typescript)
### Testing Front-End
The front-end will be tested with `Enzyme`. (https://github.com/airbnb/enzyme)
The library will provide a `shallow` method in which we can use react components and test those.
The library is allowing us to build integration UI test and UI unit test.
The library is allowing simulating 'click'.

`shallow`: isolate test to a single component 
`mount`: Used for DOM rendering, can test using lifecycle `componentDidMount`
`render`: redering static HTML in react componenent (optional function)

#### Demo UI Test 

A testing demo is available at: https://youtu.be/nvL2ha0XUYo?t=342


 
### Run Unit Test (Front-End)
 - The test are written in `test` folder
 - You can run all unit test by entering the command `npm run test`
 - You should receive results in your terminal

### Run Unit Test Coverage (Front-End)
 - You can get a unit test coverage report using the script writtien in `pakage.json`
 - Run the command: `npm run testWithCoverage` to run the test coverage
 - The command will create a folder: `coverage` with all results inside




## Database

### Connect to Mongo DB from Intellij IDE
- Download and install Mongo plugin from David
- Restart the IDE
- Search for the tool: 'Mongo Explorer'
- Create a new connection with the '[+]' button
- Enter the URL to the database e.g. `cluster0-shard-00-00-celgm.mongodb.net:27017,cluster0-shard-00-01-celgm.mongodb.net:27017,cluster0-shard-00-02-celgm.mongodb.net:27017`
- Check the SSL box
- Enter your username and password in the 'Authentication' tab and check the 'SCRAM-SHA-1' box
- Give a name to your connection in the 'label' box
- Save it !!!

### Connect to the database on our server
- ssh into the server
- Enter the shell of your database docker container by typing `docker exec -it <your db container> bash` (you can type `docker ps` to list all containers, the one with your last name followed by '-db' is yours )
- Inside the docker container, type `mongo` to get a mongodb shell
- Type `use <db>` and replace '<db>' with the database you wish to use. For example: `use test` for the 'test' database or `use recruitinc` for our production database
- At this point you can use mongo shell commands. You can autocomplete commands by typing the beginning of a command and hitting <TAB> twice. For example, to view the names of collections in the database, type `db.getCollectionNames()`. To view all entries in the 'applicants' collection, type `db.applicants.find()` etc. 
