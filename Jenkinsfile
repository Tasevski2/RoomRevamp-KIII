pipeline {
    agent any
    stages {
        stage("Build and Push Backend") {
            steps {
                script {
                    dir("./backend") {
                        checkout scm
                        def beApp = docker.build("viktortasevski/room-revamp-be")
                        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        beApp.push("${env.BUILD_NUMBER}")
                        beApp.push("latest")
                        }
                    }
                }
            }
        }

        stage('Build and Push Frontend') {
            steps {
                script {
                    dir("./client") {
                        checkout scm
                        def feApp = docker.build("viktortasevski/room-revamp-fe")
                        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        feApp.push("${env.BUILD_NUMBER}")
                        feApp.push("latest")
                        }
                    }
                }
            }
        }

        // stage('Deploying App to Kubernetes') {
        //         steps {
        //              withKubeConfig([credentialsId: 'kubernetes']) {  
        //                 sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
        //                 sh 'chmod u+x ./kubectl'
        //                 sh './kubectl apply -f jenkins-deployment.yml'
        //              } 
        //         }
        // }

        stage('Deploying App to Kubernetes') {
                steps {
                    script {
                        kubernetesDeploy(configs: "jenkins-deployment.yml", kubeconfigId: "kubeconfig")
                    }
                }
        }
    }

}