
# RecruitInc

### API Endpoints

#### Back-end calls

- http://localhost:6969/api/github/applicant/{accessToken}/{userName}

### How install the Project with JetBrain IntelliJ ?

#### MAC OS and Linux

#### Windows 


### How to run the project from terminal ?
- Open Two terminal windows 
#### Start the Back-End Node 
 - The back-end is inspired from the boiler plate: https://github.com/priyesh18/typescript-node-api
 - Navigate to the folder `recruit-inc-back`
 - You always need to install the node_modules folder
 run:  `npm install`
 - You can run the project using terminal with: `npm run dev`
 - You should receive a message: `listening on port 6969`
 - You can check the result at: **http://localhost:6969/api/hi/**

 ### Start the Front-End Node
  - Navigate to the folder `recruit-inc-front`
 - You always need to install the node_modules folder
 run:  `npm install`
 - You can run the project using terminal with: `npm start`
 - You should receive a message: `You can now view recruit-inc-front in the browser.`
 - You can check the result at: **http://localhost:3000/**


### Communication Between NodeJS application
You can try the system by sending a message to the Back-End from the Front-End
- Back-End node has a function called: http://localhost:6969/api/hi/
- Front-End will attempt to get the data returned by the get at: http://localhost:6969/api/hi
- In the Front-End, application you wil be able to see a object:

`state (3) [{…}, {…}, {…}] 0: {name: "Hi"} 1: {name: "Bonjour"} 2: {name: "Hello"} `

These data are from the other node. 
