node {
   echo '--------------------- Go Go Go CD -----------------------------------'
   stage('-----------Checkout--------------------')
   git branch: 'fixPipeline'credentialsId: 'RecruitInc-credentials', url: 'https://github.com/ddicorpo/RecruitInc.git'
   //TODO: Build Back-end
   // Navigate to recruit-inc-back and 
   // write a back-end .env
   // Build a docker image : docker build -t winterhart/node-app . (will use the Dockerfile)
   // Start the docker image : docker run -p 6969:6969 winterhart/node-app


   // TODO: Build Front-End
   // Navigate to recruit-inc-front
   // write the front-end .env
   // Build a docker image : docker build -t winterhart/node-app-front
   // Start the docker iamge: docker run -p 3000:3000 winterhart/node-app

   //That's it !!!


}