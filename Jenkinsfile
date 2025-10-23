pipeline {
    agent any

    tools {
        nodejs "node18"   // Name must match NodeJS tool configured in Jenkins
    }

    environment {
        BACKEND_DIR = "Backend/server"
        FRONTEND_DIR = "codeandchill"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out source code..."
                checkout scm
            }
        }

        stage('Backend Setup') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "📦 Installing backend dependencies..."
                    bat 'npm install'

                    echo "🧠 Checking backend TypeScript compilation..."
                    bat 'npx tsc --noEmit'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo "📦 Installing frontend dependencies..."
                    bat 'npm install'

                    echo "⚙️  Building frontend with Vite..."
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                echo "🚀 Deploying Code&Chill locally..."

                // === Backend (Node + PM2) ===
                dir("${BACKEND_DIR}") {
                    echo "🔁 Restarting backend with PM2..."
                    bat '''
                    pm2 delete codeandchill-backend || exit 0
                    pm2 start server.ts --interpreter ts-node-esm --name codeandchill-backend
                    '''
                }

                // === Frontend (Static Files) ===
                dir("${FRONTEND_DIR}") {
                    echo "📂 Copying frontend build output to deploy folder..."
                    bat 'xcopy /E /I /Y dist "E:\\CodeChill\\DeployedFrontend\\"'
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deploy successful!"
        }
        failure {
            echo "❌ Build failed — check console logs."
        }
    }
}
