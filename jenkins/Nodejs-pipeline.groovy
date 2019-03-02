import java.util.UUID

def teamMap = [:]
teamMap['benjamin.tanguay@gmail.com'] = [name: "btanguay", slack: "<@UBDKRBTFY>", front: "11000", back: "11001", database: "11002"]
teamMap['philippe.beaudry96@gmail.com'] = [name: "pbeaudry", slack: "<@UBC851WHL>", front: "12000", back: "12001", database: "12002"]
teamMap['ddicorpo@gmail.com'] = [name: "ddicorpo", slack: "<@UBB76KAV9>", front: "13000", back: "13001", database: "13002"]
teamMap['m.user.work@gmail.com'] = [name: "chardy", slack: "<@UBAP7QD4H>", front: "14000", back: "14001", database: "14002"]
teamMap['mohamed_2_27@hotmail.com'] = [name: "mfarah", slack: "<@UBBTDN7U0>", front: "15000", back: "15001", database: "15002"]
teamMap['mohamedlemineelhadj@outlook.com'] = [name: "mlemine", slack: "<@UBCAK2XV1>", front: "16000", back: "16001", database: "16002"]
teamMap['saitaghiles@gmail.com'] = [name: "asait", slack: "<@UBB9FQNAV>", front: "17000", back: "17001", database: "17002"]
teamMap['23jamesff@gmail.com'] = [name: "jferreira", slack: "<@UBKEZ2WRG>", front: "18000", back: "18001", database: "18002"]
teamMap['release'] = [name: "production", slack: "<@chaîne>", front: "80", back: "10001", database: "10002"]
teamMap['uat'] = [name: "uat", slack: "<@chaîne>", front: "9000", back: "9001", database: "9002"]

def serverIP = "http://169.45.50.135"
def builderImgName = "NodeJSBuilder"
def backendFolder = "/home/builder/recruit-inc-back"
def frontendFolder = "/home/builder/recruit-inc-front"

def jenkinsWorkspace = "/var/jenkins_home/workspace/Nodejs-pipeline"
def jenkinsProjectFolder = "RecruitInc"
def frontend = "recruit-inc-front"
def backend = "recruit-inc-back"
def jenkinsBEFolder = "$jenkinsProjectFolder/$backend"
def jenkinsFEFolder = "$jenkinsProjectFolder/$frontend"
def builderRoot = "/home/builder"

def shellInImage(imageName, command) {
    sh "docker exec -i $imageName sh -c '$command'"
}

def shellInImageDetached(imageName, command) {
    sh "docker exec -id $imageName sh -c '$command'"
}

def generateEnvFrontend(imageName, folder, backendPort, frontendPort, environment) {
    shellInImage("$imageName", "cd $folder; touch .env")

    shellInImage("$imageName", "cd $folder; echo NODE_ENV=$environment >> .env")
    shellInImage("$imageName", "cd $folder; echo PORT=$frontendPort >> .env")
    shellInImage("$imageName", "cd $folder; echo DEFAULT_TIMEOUT=2147483643 >> .env")
    shellInImage("$imageName", "cd $folder; echo DOMAIN_FRONT_END=localhost >> .env")
    shellInImage("$imageName", "cd $folder; echo BACK_END_ADDRESS=169.45.50.135 >> .env")
    shellInImage("$imageName", "cd $folder; echo BACK_END_PORT=$backendPort >> .env")
    shellInImage("$imageName", "cd $folder; echo REST_PREFIX=http:// >> .env")
}

def generateEnvBackend(imageName, folder, backendPort, frontendPort, databasePort, environment) {
    shellInImage("$imageName", "cd $folder; touch .env")
    shellInImage("$imageName", "cd $folder; echo NODE_ENV=$environment >> .env")
    shellInImage("$imageName", "cd $folder; echo PORT=$backendPort >> .env")
    shellInImage("$imageName", "cd $folder; echo DEFAULT_TIMEOUT=2147483643 >> .env")
    shellInImage("$imageName", "cd $folder; echo DOMAIN_FRONT_END=169.45.50.135:$frontendPort >> .env")
    shellInImage("$imageName", "cd $folder; echo DOMAIN_BACK_END=169.45.50.135 >> .env")
    shellInImage("$imageName", "cd $folder; echo GITHUB_DEFAULT_AUTH_TOKEN=37780cb5a0cd8bbedda4c9537ebf348a6e402baf >> .env")
    shellInImage("$imageName", "cd $folder; DB_HOST=mongodb://169.45.50.135:$databasePort")
    shellInImage("$imageName", "cd $folder; echo DB_USER= >> .env")
    shellInImage("$imageName", "cd $folder; echo DB_SCHEMA= >> .env")
    shellInImage("$imageName", "cd $folder; echo DB_PWD= >> .env")
    shellInImage("$imageName", "cd $folder; echo DB_NAME= >> .env")
}

def dockerLogin(username, password) {
    sh "docker logout; docker login --username=$username --password=$password"
}

def commitAndPushContainer(containerName, repo, tag) {
    sh "docker commit $containerName $repo:$tag"
    sh "docker push $repo:$tag"
}

def dockerClean() {

    //Try catch to avoid failure when there is nothing to be removed
    try{
        // Remove unused docker containers
        //  sh "docker rm \$(docker ps -qa --no-trunc --filter \"status=exited\")"
        // Remove unused docker volumes
        sh "docker volume ls -qf dangling=true | xargs -r docker volume rm || true"
        // Remove unused docker images
        sh "docker rmi \$(docker images --filter \"dangling=true\" -q --no-trunc) || true"
    }
    catch (exception){
        echo "$exception"
        return
    }
}

def getContainerName(partialName) {
    sh(script: "docker ps --format '{{.Names}}' > containerNames.txt", returnStatus: true)
    def containerNames = readFile("containerNames.txt").trim()
    containerNames = containerNames.split("\n")

    for (String containerName : containerNames) {

        if (containerName.contains(partialName)) {
            return containerName
        }
    }
    return "empty"
}

def isNullOrEmpty(str) {
    return !str?.trim()
}

def stopContainer(partialName) {
    def name = getContainerName(partialName)
    sh "echo Stopping $partialName container"
    sh "docker stop $name || true"
    sh "docker rm $name || true"
}

node {

    def teamMember = teamMap[committerEmail]
    def shortHash = commitHash.substring(0, 7)

    slackSend(botUser: true, color: '#FFFF00', message: "Job started: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nEnv: ${teamMember.name}\nCommit being built: https://github.com/ddicorpo/RecruitInc/commit/$commitHash \nBuild: ${env.BUILD_URL}")

    try {
        stage('Checkout') {
            echo 'CHECKOUT STAGE-----------------------------------------------------'
            checkout([$class                           : 'GitSCM',
                      branches                         : [[name: '$commitHash']],
                      doGenerateSubmoduleConfigurations: false,
                      extensions                       : [[$class           : 'RelativeTargetDirectory',
                                                           relativeTargetDir: jenkinsProjectFolder]],
                      submoduleCfg                     : [],
                      userRemoteConfigs                : [[credentialsId: 'RecruitInc-credentials', url: 'https://github.com/ddicorpo/RecruitInc.git']]])
        }



        stage('Updating builder') {
            echo "STARTING STAGE UPDATING BUILDER -------------------------------------------------"
            echo "PULLING IMAGE"
            dockerLogin("abadanpm", "abada490")
            sh "docker pull abadanpm/npm:latest"

            echo "STARTING IMAGE"
            sh "docker start $builderImgName"

            echo "COPYING FILES IN IMAGE"
            shellInImage("$builderImgName", "mkdir -p $builderRoot; mkdir -p $builderRoot/$backend; mkdir -p $builderRoot/$frontend")


            sh "docker cp $jenkinsBEFolder/. $builderImgName:$builderRoot/$backend"
            sh "docker cp $jenkinsFEFolder/. $builderImgName:$builderRoot/$frontend"

            // Updating the dependencies
            echo "UPDATING THE DEPENDENCIES"
            shellInImage("$builderImgName", "cd $backendFolder; npm install ")
            shellInImage("$builderImgName", "cd $frontendFolder; cat package.json; npm install ")

            echo "END STAGE UPDATING BUILDER -------------------------------------------------"
        }
        stage("Compiling") {
            //Backend

            echo "BEFORE ENVIRONMENT DEFINITION"
            def environment = "dev";
            if (committerEmail.equals("release")) {
                environment = "production"
            }
            echo "AFTER ENVIRONMENT DEFINITION"
            generateEnvBackend("$builderImgName", "$backendFolder", "$teamMember.back", "$teamMember.front", "$teamMember.database", "$environment")
            echo "AFTER GENERATE BACKEND"
            shellInImage("$builderImgName", "cd $backendFolder; npm run build")

            //Frontend
            generateEnvFrontend("$builderImgName", "$frontendFolder", "$teamMember.back", "$teamMember.front", "$environment")
            shellInImage("$builderImgName", "cd $frontendFolder; npm run build")


        }
        stage("Testing") {
            shellInImage("$builderImgName", "cd $backendFolder; npm run test")
            shellInImage("$builderImgName", "cd $frontendFolder; npm run test")
        }
        stage("Packaging") {
            shellInImage("$builderImgName", "cd $backendFolder; pkg --targets node8-alpine-x64 dist/src/server.js")

            shellInImage("$builderImgName", "cd $frontendFolder; pkg --targets node8-alpine-x64 src/server.ts")

        }
        stage("Deploying") {
            dockerLogin("abadafrontend", "abada490")
            sh "docker pull abadafrontend/frontend:base"
            def frontendImg = "${teamMember.name}-frontend-$shortHash"
            stopContainer("${teamMember.name}-frontend")
            sh "docker run -id --name $frontendImg -p ${teamMember.front}:$teamMember.front  --net=bridge abadafrontend/frontend:base sh"

            sh "docker start $frontendImg"
            shellInImage("$frontendImg", "mkdir -p $builderRoot")
            sh 'mkdir -p frontend'
            sh "docker cp $builderImgName:/$builderRoot/. frontend"
            sh "docker cp frontend/. $frontendImg:/$builderRoot"

            shellInImageDetached("$frontendImg", "cd $builderRoot/$frontend; npm run start")

            dockerLogin("abadabackendnode", "abada490")
            sh "docker pull abadabackendnode/backend:base"

            def backendImg = "${teamMember.name}-backend-$shortHash"
            stopContainer("${teamMember.name}-backend")
            sh "docker run -id --name $backendImg -p ${teamMember.back}:$teamMember.back --net=bridge abadabackendnode/backend:base sh"
            sh "docker start $backendImg"
            shellInImage("$backendImg", "mkdir -p $builderRoot")

            sh 'mkdir -p backend'
            //Create .env file with frontend domain so that it is whitelisted
            //Add other env variables




            //Copy from builder image container to jenkins container
            sh "docker cp $builderImgName:/$backendFolder/server backend"
            sh "docker cp $builderImgName:/$backendFolder/.env backend"


            sh "docker cp backend/. $backendImg:/$builderRoot"

            shellInImageDetached("$backendImg", "cd $builderRoot; ./server")


            slackSend(botUser: true, color: '#08ff00', message: "${teamMember.slack}\nBuild deployed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nEnv: ${teamMember.name}\nFront end: ${serverIP}:${teamMember.front}\nBack end: ${serverIP}:${teamMember.back}\nDatabase: ${serverIP}:${teamMember.database}\nBuild: ${env.BUILD_URL}")
        }
        stage("Saving the builder") {

            sh 'rm -rf *'
            dockerClean()

            echo "CLEANING UP THE FOLDER EXCEPTED THE DEPENDENCIES"
            shellInImage("$builderImgName", "cd $backendFolder; ls | grep -v node_modules | xargs rm -rf")
            shellInImage("$builderImgName", "cd $backendFolder; rm .env")

            shellInImage("$builderImgName", "cd $frontendFolder; ls | grep -v node_modules | xargs rm -rf")
            shellInImage("$builderImgName", "cd $frontendFolder; rm .env")

            echo "COMMITING CHANGES TO IMAGE"
            dockerLogin("abadanpm", "abada490")
            commitAndPushContainer(builderImgName, "abadanpm/npm", "latest")
            sh "docker stop $builderImgName"
            /*dockerLogin("abadabackendnode", "abada490")
            commitAndPushContainer(builderImgName, "abadabackendnode/backend", "$shortHash")
            dockerLogin("abadafrontend", "abada490")
            commitAndPushContainer(builderImgName, "abadafrontend/frontend", "$shortHash")*/
        }
    }
    catch (exception) {
        slackSend(botUser: true, color: '#ff0000', message: "${teamMember.slack}\nBuild failure: ${env.JOB_NAME} [${env.BUILD_NUMBER}]\nBuild: ${env.BUILD_URL}\nConsole log: http://169.45.50.135:8080/job/${env.JOB_NAME}/${env.BUILD_NUMBER}/console")
        echo "CLEANING UP THE FOLDER EXCEPTED THE DEPENDENCIES"
        sh 'rm -rf *'
        dockerClean()

        echo "CLEANING UP THE FOLDER EXCEPTED THE DEPENDENCIES"
        shellInImage("$builderImgName", "cd $backendFolder; ls | grep -v node_modules | xargs rm -rf")
        shellInImage("$builderImgName", "cd $frontendFolder; ls | echo grep -v node_modules | xargs rm -rf")
        echo "$exception"
        throw exception
    }

}
