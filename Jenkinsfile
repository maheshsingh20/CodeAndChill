pipeline {
    agent any

    tools {
        nodejs "node18"   // Must match name in Jenkins Tools config
    }

    environment {
        BACKEND_DIR = "Backend/server"
        FRONTEND_DIR = "codeandchill"
        DEPLOY_DIR = "E:\\CodeChill\\DeployedFrontend"
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
                    bat 'npx tsc --noEmit || exit 1'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo "📦 Installing frontend dependencies..."
                    bat 'npm install'

                    echo "⚙️  Building frontend with Vite..."
                    bat 'npm run build || exit 1'
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
                    bat '''
                    if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"
                    xcopy /E /I /Y dist "%DEPLOY_DIR%"
                    '''
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
