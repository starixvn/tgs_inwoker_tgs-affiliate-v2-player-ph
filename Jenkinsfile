@Library('global-shared-library') _
def message = "";
pipeline {
    agent any
    environment {
        TAG = sh(script: "echo `date +%Y-%m%d-%H%M`", returnStdout: true).trim()
        Registry = "pgtgs/"
        dockerhub = credentials('dockerhub')
        Image = "agent-v2"
    }

    stages {		    	
        stage('Prepare Env') {
            steps {
                cleanWs()
                checkout scm
                sh "docker login -u ${dockerhub_USR} -p ${dockerhub_PSW}"
                sh "echo 'Branch: ${env.GIT_BRANCH}'";
                script {
                    switch(env.GIT_BRANCH)
                    {
                        case ['master', 'origin/master']:
                            env.kube_ns = "prod";
                            env.k8s_config = 'prod-k8s-config';
                            break;
                        case ['release/current', 'origin/release/current']:
                            env.kube_ns = "staging";
                            env.k8s_config = 'stag-k8s-config';
                            break;
                        case ['develop', 'origin/develop']:
                            env.kube_ns = "dev";
                            env.k8s_config = 'k8s-kube-config';
                            break;
                        default:
                            env.kube_ns = "develop";
                            env.k8s_config = 'k8s-kube-config' 
                            break;
                    }
                    TAG = env.kube_ns + '-' + TAG
                    MergedTag = 'merged-' + TAG
                    message += "\nBranch: ${env.GIT_BRANCH}" 
                    message += "\nImage: ${Image}"
                    message += "\nTag: ${TAG}"
                    message += "\nEnv: $env.kube_ns"
                    env.commit_url = "${env.GIT_URL}".replace(".git","/-/commit/") + "${env.GIT_COMMIT}"
                    message += "\n Commit: ${env.commit_url}"
                }


                sh "echo 'env: $env.kube_ns'"
                sh "echo 'tag: ${TAG}'"
            }
        } 
        stage('Npm Install') {   
            steps {                 
                sh "npm install --force"
            }
        } 
        
        stage('Npm Build') {   
            steps {  
                script {
                   
                     withKubeConfig([credentialsId: env.k8s_config]) {
                        def data = readYaml file: "brands_${env.kube_ns}.yaml"
                        for (i = 0;i <  data.brands.size(); i++) {
                          
                            deploy="${data.brands[i].deploy}"
                            image_tag="pgtgs/${data.brands[i].deploy}:$Tag"
                            
                            sh "npm run gitlab-build -- BRAND=${data.brands[i].brand} API_URL=/ SITE=${data.brands[i].site} DEFAULT_LANGUAGE=${data.brands[i].lang} vite build -m prod"
                            echo "image_tag=$image_tag"
                            
                            sh "docker build -t $image_tag ."
                            sh "docker push $image_tag"
                            sh "kubectl set image deployment/$deploy $deploy=$image_tag -n $env.kube_ns"
                            
                            sh "echo '=============='"
                        }
                    }
                }    
            }
        }   
    }
    post {
        success {
             sendTelegram("Pipeline: ${currentBuild.fullDisplayName} OK! ${message} \n${currentBuild.getBuildCauses()[0].shortDescription}\n")
        }
        failure {
            sendTelegram("<b>Failed Pipeline:</b> ${currentBuild.fullDisplayName} Something is wrong with ${env.BUILD_URL}/console\n${currentBuild.getBuildCauses()[0].shortDescription}\n")
        }
    }
}
