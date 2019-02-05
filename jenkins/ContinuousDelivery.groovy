node {
   def serverIP = '169.45.50.135'
   def productionPortBE = 10001
   def productionPortFE = 80
   def jenkinsProjectFolder = "RecruitInc"

   def teamMap = [:]
   teamMap['release'] = [name: "production", slack: "<@chaîne>", front: "80", back: "10001", database: "10002"]

   stage('Remove old build'){
      sh "rm -rf RecruitInc"
   }
   stage('Checkout') {
      echo 'CHECKOUT STAGE-----------------------------------------------------'
      checkout([$class                           : 'GitSCM',
               branches                         : [[name: '*/master']],
               doGenerateSubmoduleConfigurations: false,
               extensions                       : [[$class : 'RelativeTargetDirectory',relativeTargetDir: jenkinsProjectFolder]],
               submoduleCfg                     : [],
               userRemoteConfigs                : [[credentialsId: 'RecruitInc-credentials', url: 'https://github.com/ddicorpo/RecruitInc.git']]])
        }
   
   //TODO: Build Back-end
   // Navigate to recruit-inc-back and 
   // write a back-end .env
   // Build a docker image : docker build -t winterhart/node-app . (will use the Dockerfile)
   // Start the docker image : docker run -p 6969:6969 winterhart/node-app


   // TODO: Build Front-End
   // Navigate to recruit-inc-front
   // write the front-end .env
   sh "cd RecruitInc/recruit-inc-front"
   sh "ls"
   sh 'touch .env'
   sh "echo NODE_ENV=dev >> .env"
   sh "echo PORT=3000 >> .env"
   sh "echo DEFAULT_TIMEOUT=2147483643 >> .env"
   sh "echo DOMAIN_FRONT_END=$serverIP:$productionPortFE >> .env"
   sh "echo BACK_END_ADDRESS=169.45.50.135 >> .env"
   sh "echo BACK_END_PORT=$productionPortBE >> .env"
   sh "echo REST_PREFIX=http:// >> .env"
   sh "ls"
   sh "cat .env"

   // Build a docker image : docker build -t winterhart/node-app-front
   // Start the docker iamge: docker run -p 3000:3000 winterhart/node-app

   //That's it !!!


}