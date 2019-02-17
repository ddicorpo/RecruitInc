node {
   def nodejsImage = docker.image("abadanpm/npm")
    
    docker.withRegistry('', 'node-npm-pkg-credentials'){
    
        
    nodejsImage.pull()
    
    }
    
    stage('Checkout'){
        echo 'CHECKOUT STAGE-----------------------------------------------------'
        git branch: 'backend_dockerfile', credentialsId: 'RecruitInc-credentials', url: 'https://github.com/ddicorpo/RecruitInc.git'
    }
    nodejsImage.inside(){

    stage('Install dependencies for BackEnd'){
         withEnv([
        'npm_config_cache=npm-cache',
        'HOME=.',
    ]) {
        echo 'Install dependencies STAGE-----------------------------------------------------'
        sh 'cd BackEnd && npm install'
    }
    
    stage('Package BackEnd'){
         withEnv([
        'npm_config_cache=npm-cache',
        'HOME=.',
    ]) {
        echo 'BUILD STAGE-----------------------------------------------------'
        sh 'cd BackEnd && pkg --targets node8-linux-x64 index.js'
    }
    }
    }
    }
    
    stage('Deploy'){
    def backendImage = docker.build("backend-image:${env.BUILD_ID}", "./BackEnd")
    
    //Commands inside withRun block are not executed inside the container
    backendImage.withRun('-p 6969:6969'){c ->
    //Keep container alive for a while
    sh 'sleep 2'
    }
    }
    
}