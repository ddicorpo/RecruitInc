
# RecruitInc

## Demo UI 

A testing demo is available at: https://youtu.be/nvL2ha0XUYo?t=342

## Environment Setup

    Tool       | Version      | Usage                       | Link
    ---------- | ------------ | ------------------------------ | ------------------------------------------------------------------------------
    `docker`   | `>= v18.3.1` | Build container images         | [docker.com](https://docs.docker.com/install/#supported-platforms)
    `NodeJS`  | `>= v11.14` | Main Server/Run time    | [nodejs](https://nodejs.org/en/)
    `npm` | `v6.9 ` | Package manager | [npm](https://www.npmjs.com/)
    `MongoDB` | `>= v3.4` | NoSQL cluster   | [MongoDB](https://www.mongodb.com/)



## Debug Configuration for back-end using Intellij

- Install `nodejs` plugin is they are not installed
- Choose **add configuration** in **Run/Debug Configurations** panel
- In the configuration tab, set the `Node Interpreter:` to `usr/local/bin/node`
- In the configuration tab, set the  `Node parameter` to `--inspect-brk`
- In the configuration tab, set the `working directory:` to `YOUR_PATH.../recruit-inc-back`
- In the configuration tab, set the `JavaScript File:` to `dist/server.js`
- Give a name to the configuration and save.
- You should be able to debug from normal runtime (not from a test)

## How to start the project?

1. Setup the multiple .env files
2. Start all services using docker

### Setup `.env` envrionment 


#### Back-End

- You need to write one `.env` in the recruit-inc-back
- It needs to have the same variable as `recruit-inc-back/.env.example`
- You need to set your NODE_ENV as either dev or production
- In order to reach the front end, set your DOMAIN_FRONT_END=http://localhost:3000
- To reach your back end set your DOMAIN_BACK_END=localhost:6969
- To connect to a database set your DB_NAME variable to your db of choice.


#### Front-End

- You need to write one `.env` in the recruit-inc-front
- It needs to have the same variables as `recruit-inc-front/.env.example`
- You need to set your NODE_ENV as either dev or production
- Make sure your PORT=3000
- Make sure Set your BACK_END_PORT=6969

#### Logging-system
- You need to write a `.env` for the Logging
- You can simply copy/paste and rename `.env.example`
- Fill all variable in new `.env` file


#### Toggle-Feature
- You need to write a `.env` for the Feature-Toggle
- You can simply copy/paste and rename `.env.example`
- Fill all variable in new `.env` file

#### Recruit-Inc-Questionnaire-Front
- You need to write a `.env` for the Feature-Toggle
- You can simply copy/paste and rename `.env.example`
- Modify the variable in new `.env` file


### Launch Containers

Each service has a `Dockerfile` the project can be launched using Docker.
You should make sure to launch the `toggle-feature` first. 

#### Toggle-feature Commands:
- docker login [...]
- Navigate to directory `cd toggle-feature`
- Build the docker container `docker build -t $USER/features`
- Start the docker container: `docker run -p 3547:3547 $USER/features .`

### Logging System Docker Commands:
- docker login [...]
- Navigate to directory `cd logging-system`
- Build the docker container `docker build -t $USER/logging`
- Start the docker container: `docker run -p 5656:5656 $USER/logging .`


#### Back-End Docker Commands:
- docker login [...]
- Navigate to the directory `cd recruit-inc-back`
- Build the docker container: `docker build -t $USER/node-app .`
- Start the docker container: `docker run -p 6969:6969 $USER/node-app .`

#### Front-End Docker Commands:
- docker login [...]
- Navigate to the directory: `cd recruit-inc-front`
- Build the docker container: `docker build -t $USER/node-app-front .`
- Start the docker container: `docker run -p 3000:3000 $USER/node-app-front .`

#### Front-End Questionnaire Commands:
- docker login [...]
- Navigate to the directory: `cd recruit-inc-questionnaire-front`
- Build the docker container: `docker build -t $USER/node-app-frontq`
- Start the docker container: `docker run -p 3001:3001 $USER/node-app-frontq `


## Testing

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

### Run Unit Test (Front-End)
 - The test are written in `test` folder
 - You can run all unit test by entering the command `npm run test`
 - You should receive results in your terminal

### Run Unit Test Coverage (Front-End)
 - You can get a unit test coverage report using the script writtien in `pakage.json`
 - Run the command: `npm run testWithCoverage` to run the test coverage
 - The command will create a folder: `coverage` with all results inside



 ### How to run an integration test

- All Integration tests files contain the keyword "Integration" in their file names
- In each integration file, make sure to remove `x` from the `xdescribe`
- Open your terminal, navigate to the recruit-inc-back folder and type the command: `npm run test`.



(attempt to use/install Jest + enzyme + webpack + typescript)

### Testing Front-End
- The front-end will be tested with `Enzyme`. (https://github.com/airbnb/enzyme)
- The library will provide a `shallow` method in which we can use react components and test those.
- The library is allowing us to build integration UI test and UI unit test.
- The library is allowing simulating 'click'.


`shallow`: isolate test to a single component 
`mount`: Used for DOM rendering, can test using lifecycle `componentDidMount`
`render`: redering static HTML in react componenent (optional function)


## Database

### Connect to Mongo DB from Intellij IDE

- Download and install Mongo plugin from David
- Restart the IDE
- Search for the tool: 'Mongo Explorer'
- Create a new connection with the '[+]' button
- Enter the URL to the database
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


## Logging

### Online Log Storage
- In production, all logs are stored in a MongoDB database

### Local Log Storage

- Navigate to the folder: recruit-inc-back. 
- Among the sub-directories, choose the folder called log.
- Inside the log folder, you will find 6 different JSON files: (debug,error,info,silly,verbose,warn).

### Toggle-feature

The back-end and front-end a dependent on the feature toggle. 
Features like `candidate sorting` are controlled by feature toggle.

### Cron-job

Our unique cron-job is used to collect data from `GitHub`. 
