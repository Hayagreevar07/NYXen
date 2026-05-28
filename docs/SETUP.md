# Nyxen Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Free Deployment Setup](#free-deployment-setup)
4. [Firebase Configuration](#firebase-configuration)
5. [Elastic Stack Setup](#elastic-stack-setup)
6. [Environment Variables](#environment-variables)
7. [Database Initialization](#database-initialization)
8. [Running the Application](#running-the-application)

## Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **MongoDB** 5.0 or higher
- **Git** 2.0 or higher

### Required Accounts
- Google Gemini API Key
- Firebase Project
- MongoDB Atlas Account (or local MongoDB)
- Vercel Account (frontend deployment)
- Render Account (backend deployment)
- Elastic Cloud Account (or self-hosted Elastic)

### System Requirements
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 10GB minimum
- **CPU**: Dual-core minimum

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nyxen.git
cd nyxen
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your values
nano .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup

```bash
cd ../backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your values
nano .env

# Start development server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 4. MongoDB Setup

#### Using Docker

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

#### Using MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

#### Local Installation

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

**Windows:**
Download installer from https://www.mongodb.com/try/download/community

## Free Deployment Setup

### 1. Prepare the Backend for Render

1. Push the repository to GitHub.
2. Create a new Web Service on Render.
3. Set the root directory to `backend`.
4. Build command: `npm ci && npm run build`
5. Start command: `npm start`
6. Add environment variables from the backend `.env` template.

### 2. Prepare the Frontend for Vercel

1. Import the repository into Vercel.
2. Set the root directory to `frontend`.
3. Add `VITE_API_URL` to point at the Render backend URL.
4. Deploy the project.

### 3. Get Gemini API Key

1. Go to Google AI Studio.
2. Create an API key.
3. Add it to `.env`: `GEMINI_API_KEY=your_key`

## Firebase Configuration

### 1. Create Firebase Project

1. Go to https://firebase.google.com
2. Click "Go to console"
3. Create a new project
4. Enable Authentication
5. Create a Web App

### 2. Get Firebase Config

1. In Firebase Console, go to Project Settings
2. Copy the config object
3. Add to frontend `.env`:

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### 3. Enable Authentication Methods

1. Go to Authentication > Sign-in methods
2. Enable Email/Password
3. Enable Google Sign-In
4. Add authorized domains

## Elastic Stack Setup

### Option 1: Elastic Cloud (Recommended)

1. Go to https://www.elastic.co/cloud
2. Create a deployment
3. Get the Cloud ID and credentials
4. Update `.env`:

```env
ELASTIC_HOST=https://your-deployment.es.us-central1.gcp.cloud.es.io
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your_password
```

### Option 2: Docker Compose

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=password
    ports:
      - "9200:9200"
  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_USERNAME=elastic
      - ELASTICSEARCH_PASSWORD=password
EOF

# Start services
docker-compose up -d
```

### Option 3: Self-Hosted

Follow the official Elastic documentation at:
https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html

## Environment Variables

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

```

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/nyxen

# JWT
JWT_SECRET=your_very_secure_random_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-pro

# Elastic
ELASTIC_HOST=https://localhost:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your_elastic_password
ELASTIC_INDEX_PREFIX=nyxen

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your-email@appspot.gserviceaccount.com

# Features
ENABLE_ELASTIC_LOGGING=true
ENABLE_GEMINI_ANALYSIS=true
ENABLE_AUTONOMOUS_RESPONSE=true

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json
```

## Database Initialization

### Create Initial Indexes

```bash
cd backend

# Run MongoDB and execute:
mongosh

# In mongosh console:
use nyxen
db.users.createIndex({ email: 1 }, { unique: true })
db.threats.createIndex({ userId: 1, createdAt: -1 })
db.threats.createIndex({ severity: 1, status: 1 })
db.loginattempts.createIndex({ userId: 1, attemptAt: -1 })
db.loginattempts.createIndex({ ipAddress: 1 })
```

### Create Initial Elastic Indexes

```bash
# In Kibana Dev Tools, run:
PUT /nyxen-threats
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "userId": { "type": "keyword" },
      "type": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "confidence": { "type": "integer" },
      "detectedAt": { "type": "date" },
      "status": { "type": "keyword" }
    }
  }
}
```

## Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - MongoDB (if local):**
```bash
mongod
```

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Verification

### Test API Connection

```bash
# Check health
curl http://localhost:5000/health

# Check API version
curl http://localhost:5000/api/version

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Frontend

Open browser to `http://localhost:3000`
- Should see landing page
- Can navigate to login
- Can create account
- Can access dashboard

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # frontend
lsof -i :5000  # backend

# Kill process
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Check MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Verify connection string in .env
```

### Elastic Connection Failed

```bash
# Check Elastic is running and accessible
curl -u elastic:password https://localhost:9200

# Verify credentials in .env
```

### Gemini API Error

```bash
# Verify API key
# Check API key status in Google AI Studio
# Verify account has quota
```

## Next Steps

1. Read [API Documentation](./API.md)
2. Check [Deployment Guide](./DEPLOYMENT.md)
3. Review [Architecture Guide](./ARCHITECTURE.md)
4. Join community discussions

## Support

- GitHub Issues: Report bugs
- Email: support@nyxen.ai
- Documentation: https://docs.nyxen.ai

---

**Happy coding! 🚀**
