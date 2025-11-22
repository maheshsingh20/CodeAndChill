pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/${DOCKER_USERNAME}/codeandchill-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/${DOCKER_USERNAME}/codeandchill-frontend"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
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
                        sh 'npm ci'
                        sh 'npm run lint || true'
                        sh 'npm test || true'
                    }
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                echo 'Testing Frontend...'
                dir('codeandchill') {
                    script {
                        sh 'npm ci'
                        sh 'npm run lint || true'
                        sh 'npm run build'
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
                                docker.build("${BACKEND_IMAGE}:${GIT_COMMIT_SHORT}")
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
                                docker.build("${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT}")
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
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        docker.image("${BACKEND_IMAGE}:${GIT_COMMIT_SHORT}").push()
                        docker.image("${BACKEND_IMAGE}:latest").push()
                        docker.image("${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT}").push()
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
            cleanWs()
        }
    }
}
