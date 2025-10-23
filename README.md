# Code&Chill 🎬💻

Code&Chill is a full-stack web application built with **Node.js**, **TypeScript**, and **Vite** for frontend. It allows users to explore and manage content seamlessly, backed by a **MongoDB** database. The project includes **CI/CD with Jenkins** and can be deployed locally or on **AWS** for production use.

---

## Features

- Full-stack TypeScript application
- Node.js backend with RESTful APIs
- Frontend built with React + Vite
- MongoDB integration for data persistence
- Automated CI/CD using Jenkins
- Local and AWS deployment support
- Seed script to populate initial course data

---

## Tech Stack

| Layer       | Technology |
|------------|------------|
| Backend    | Node.js, TypeScript, Express |
| Frontend   | React, TypeScript, Vite |
| Database   | MongoDB |
| Deployment | PM2 (local), AWS EC2 / S3, Jenkins CI/CD |
| Tools      | Git, Node.js, NPM |

---

## Prerequisites

- Node.js v18+
- NPM
- MongoDB (running locally or in AWS)
- PM2 (`npm install -g pm2`)
- Jenkins with NodeJS plugin installed
- Git

---

## Project Setup

### Frontend Setup

```bash
# Navigate to frontend directory
cd codeandchill

# Install dependencies
npm install

# Run the development server
npm run dev
