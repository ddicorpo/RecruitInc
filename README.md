
# RecruitInc

### API Endpoints

#### Back-end calls

- GET: http://localhost:6969/api/github/applicant/{accessToken}/{userName}
- GET: http://localhost:6969/api/github/applicant/admin

### How install the Project with JetBrain IntelliJ ?

#### MAC OS and Linux

#### Windows 


### How to run the project from terminal ?
- Open Two terminal windows 

### Start the Back-End Node 
 - The back-end is inspired from the boiler plate: https://github.com/priyesh18/typescript-node-api
 - Navigate to the folder `recruit-inc-back`
 - You always need to install the node_modules folder
 run:  `npm install`
 - You can run the project using terminal with: `npm run dev`
 - You should receive a message: `listening on port 6969`
 - You can check the result at: **http://localhost:6969/api/hi**

#### Run Unit Test (Back-End)
 - The test are written in `test` folder
 - You can run all unit test by entering the command `npm run test`
 - You should receive results in your terminal

#### Run Unit Test Coverage (Back-End)
 - You can get a unit test coverage report using the script writtien in `pakage.json`
 - Run the command: `npm run testWithCoverage` to run the test coverage
 - The command will create a folder:  `coverage` with all results inside
 - Sample Result:
 
![alt text](https://github.com/ddicorpo/RecruitInc/blob/master/CourseAdmin/assets/SampleTestCoverage.png "Sample Test Coverage")

 ### Start the Front-End Node
  - Navigate to the folder `recruit-inc-front`
 - You always need to install the node_modules folder
 run:  `npm install`
 - You can run the project using terminal with: `npm run dev`
 - You can build the project with `npm run build`
 - You should receive a message: `You can now view recruit-inc-front in the browser.`
 - You can check the result at: **http://localhost:3000/**
 
#### Run Unit Test (Front-End)
 - The test are written in `test` folder
 - You can run all unit test by entering the command `npm run test`
 - You should receive results in your terminal

#### Run Unit Test Coverage (Front-End)
 - You can get a unit test coverage report using the script writtien in `pakage.json`
 - Run the command: `npm run testWithCoverage` to run the test coverage
 - The command will create a folder: `coverage` with all results inside
 
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

### DevOps Pipeline Step
