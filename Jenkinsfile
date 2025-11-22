pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/${DOCKER_USERNAME}/codeandchill-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/${DOCKER_USERNAME}/codeandchill-frontend"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Test Backend') {
            steps {
                echo 'Testing Backend...'
                dir('Backend/server') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                            sh 'npm run lint || true'
                            sh 'npm test || true'
                        } else {
                            bat 'npm ci'
                            bat 'npm run lint || exit 0'
                            bat 'npm test || exit 0'
                        }
                    }
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                echo 'Testing Frontend...'
                dir('codeandchill') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                            sh 'npm run lint || true'
                            sh 'npm run build'
                        } else {
                            bat 'npm ci'
                            bat 'npm run lint || exit 0'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            when {
                branch 'main'
            }
            parallel {
                stage('Build Backend') {
                    steps {
                        echo 'Building Backend Docker Image...'
                        dir('Backend/server') {
                            script {
                                def gitCommit = bat(script: '@git rev-parse --short HEAD', returnStdout: true).trim()
                                docker.build("${BACKEND_IMAGE}:${gitCommit}")
                                docker.build("${BACKEND_IMAGE}:latest")
                            }
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        echo 'Building Frontend Docker Image...'
                        dir('codeandchill') {
                            script {
                                def gitCommit = bat(script: '@git rev-parse --short HEAD', returnStdout: true).trim()
                                docker.build("${FRONTEND_IMAGE}:${gitCommit}")
                                docker.build("${FRONTEND_IMAGE}:latest")
                            }
                        }
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing images to Docker Hub...'
                script {
                    def gitCommit = bat(script: '@git rev-parse --short HEAD', returnStdout: true).trim()
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image("${BACKEND_IMAGE}:${gitCommit}").push()
                        docker.image("${BACKEND_IMAGE}:latest").push()
                        docker.image("${FRONTEND_IMAGE}:${gitCommit}").push()
                        docker.image("${FRONTEND_IMAGE}:latest").push()
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Production...'
                script {
                    sshagent(credentials: ['production-server-ssh']) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "
                                cd ${DEPLOY_PATH} &&
                                docker-compose pull &&
                                docker-compose up -d &&
                                docker system prune -f
                            "
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            // Optional: Send notification
            // emailext subject: "Jenkins Build Success: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //          body: "Build succeeded!",
            //          to: "${env.NOTIFICATION_EMAIL}"
        }
        failure {
            echo 'Pipeline failed!'
            // Optional: Send notification
            // emailext subject: "Jenkins Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //          body: "Build failed. Check Jenkins for details.",
            //          to: "${env.NOTIFICATION_EMAIL}"
        }
        always {
            echo 'Cleaning up...'
            deleteDir()
        }
    }
}
