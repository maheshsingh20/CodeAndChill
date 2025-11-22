#!/bin/bash

# Jenkins Installation Script for Ubuntu/Debian
# Run with: sudo bash jenkins-setup.sh

set -e

echo "========================================="
echo "Installing Jenkins on Ubuntu/Debian"
echo "========================================="

# Update system
echo "Updating system packages..."
apt-get update

# Install Java (Jenkins requirement)
echo "Installing Java..."
apt-get install -y openjdk-11-jdk

# Add Jenkins repository
echo "Adding Jenkins repository..."
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
echo "Installing Jenkins..."
apt-get update
apt-get install -y jenkins

# Install Docker
echo "Installing Docker..."
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Add Jenkins user to Docker group
echo "Adding Jenkins to Docker group..."
usermod -aG docker jenkins

# Install Node.js (for testing)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Start Jenkins
echo "Starting Jenkins..."
systemctl start jenkins
systemctl enable jenkins

# Get initial admin password
echo "========================================="
echo "Jenkins Installation Complete!"
echo "========================================="
echo ""
echo "Jenkins is running on: http://localhost:8080"
echo ""
echo "Initial Admin Password:"
cat /var/lib/jenkins/secrets/initialAdminPassword
echo ""
echo "========================================="
echo "Next Steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Use the password above to unlock Jenkins"
echo "3. Install suggested plugins"
echo "4. Create your first admin user"
echo "5. Follow the JENKINS-SETUP.md guide"
echo "========================================="
