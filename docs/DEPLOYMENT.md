# Nyxen Deployment Guide

## Table of Contents
1. [Free Deployment Stack](#free-deployment-stack)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Production Configuration](#production-configuration)
5. [Monitoring & Logging](#monitoring--logging)
6. [Scaling & Performance](#scaling--performance)

## Free Deployment Stack

### Backend on Render

```bash
# Push the repository to GitHub first.
# In Render:
# - Create a new Web Service
# - Root directory: backend
# - Build command: npm ci && npm run build
# - Start command: npm start
# - Add environment variables from backend/.env.example
```

### Frontend on Vercel

```bash
# In Vercel:
# - Import the GitHub repo
# - Root directory: frontend
# - Build command: npm run build
# - Output directory: dist
# - Set VITE_API_URL to your Render backend URL
```

## Docker Deployment

### Create Dockerfile for Backend

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Copy built app from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', r => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/index.js"]
```

### Build & Push Image

```bash
# Build image
docker build -t nyxen-backend:latest backend/

# Push to Docker Hub or your preferred container registry
docker push your-dockerhub-username/nyxen-backend:latest
```

### Docker Compose for Local Production Testing

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6-alpine
    container_name: nyxen-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - nyxen-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    container_name: nyxen-elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=${ELASTIC_PASSWORD}
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - nyxen-network

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: nyxen-backend
    restart: unless-stopped
    depends_on:
      - mongodb
      - elasticsearch
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/nyxen?authSource=admin
      ELASTIC_HOST: https://elasticsearch:9200
      ELASTIC_PASSWORD: ${ELASTIC_PASSWORD}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: http://localhost:3000
    ports:
      - "5000:5000"
    networks:
      - nyxen-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    container_name: nyxen-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    networks:
      - nyxen-network

volumes:
  mongodb_data:
    driver: local
  elasticsearch_data:
    driver: local

networks:
  nyxen-network:
    driver: bridge
```

### Run Docker Compose

```bash
# Create .env file with secrets
cat > .env << 'EOF'
MONGO_PASSWORD=your_secure_password
ELASTIC_PASSWORD=your_elastic_password
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_jwt_secret
EOF

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## Kubernetes Deployment

### Create Kubernetes Manifests

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nyxen-backend
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nyxen-backend
  template:
    metadata:
      labels:
        app: nyxen-backend
    spec:
      containers:
      - name: nyxen-backend
        image: nyxen-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: nyxen-secrets
              key: mongodb-uri
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: nyxen-secrets
              key: gemini-api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nyxen-backend
spec:
  type: LoadBalancer
  selector:
    app: nyxen-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
```

### Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic nyxen-secrets \
  --from-literal=mongodb-uri="mongodb://..." \
  --from-literal=gemini-api-key="..." \
  --from-literal=jwt-secret="..."

# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get svc

# View logs
kubectl logs deployment/nyxen-backend -f

# Scale replicas
kubectl scale deployment nyxen-backend --replicas=5
```

## Production Configuration

### Environment Variables

```env
# Security
NODE_ENV=production
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">

# Database
MONGODB_URI=mongodb://username:password@host:port/nyxen?authSource=admin

# Gemini
GEMINI_API_KEY=<from Google AI Studio>
GEMINI_MODEL=gemini-1.5-pro

# Elastic
ELASTIC_HOST=https://elastic.example.com:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=<strong_password>
ELASTIC_INDEX_PREFIX=nyxen

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS
CORS_ORIGIN=https://yourdomain.com

# Features
ENABLE_ELASTIC_LOGGING=true
ENABLE_GEMINI_ANALYSIS=true
ENABLE_AUTONOMOUS_RESPONSE=true
```

### Security Best Practices

1. **Use HTTPS everywhere**
   ```nginx
   # nginx config
   server {
     listen 443 ssl http2;
     ssl_certificate /path/to/cert.pem;
     ssl_certificate_key /path/to/key.pem;
     ssl_protocols TLSv1.2 TLSv1.3;
   }
   ```

2. **Enable HSTS**
   ```
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

3. **Rate Limiting**
   ```javascript
   // In backend
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

4. **Secrets Management**
   ```bash
   # Use Google Secret Manager
  # Store the key in your deployment platform's secret manager
  # or add it to your service environment variables
   ```

## Monitoring & Logging

### Logging

```bash
# Use your platform logs:
# - Render logs for backend
# - Vercel deployment logs for frontend
# - Docker logs for local deployments
```

### Elasticsearch Monitoring

```bash
# Monitor cluster health
GET /_cluster/health

# Check index status
GET /_cat/indices

# Monitor query performance
GET /.monitoring-es-*/_search?q=type:indices
```

### Application Metrics

```javascript
// Add to backend/src/utils/metrics.ts
export const metrics = {
  requestsTotal: new Counter({
    name: 'requests_total',
    help: 'Total HTTP requests',
  }),
  requestDuration: new Histogram({
    name: 'request_duration_seconds',
    help: 'HTTP request duration in seconds',
  }),
  threatsDetected: new Counter({
    name: 'threats_detected_total',
    help: 'Total threats detected',
  }),
};
```

## Scaling & Performance

### Horizontal Scaling

```bash
# Auto-scale with Kubernetes
kubectl autoscale deployment nyxen-backend \
  --min=3 \
  --max=10 \
  --cpu-percent=80

# Check HPA status
kubectl get hpa
```

### Database Optimization

```javascript
// Enable MongoDB indexing
db.threats.createIndex({ userId: 1, detectedAt: -1 })
db.threats.createIndex({ severity: 1, status: 1 })

// Enable Elasticsearch caching
PUT /_cluster/settings
{
  "transient": {
    "indices.cache.filter.size": "40%"
  }
}
```

### CDN Setup

```bash
# For frontend with Cloudflare
# Set up page rules for caching
# Enable Brotli compression
# Set cache levels appropriately
```

### Load Testing

```bash
# Using Apache Bench
ab -n 10000 -c 100 http://localhost:5000/health

# Using wrk
wrk -t12 -c400 -d30s http://localhost:5000/health
```

---

**Production deployment is now ready!**
