# 🚀 Nyxen - Quick Start Checklist

## Pre-Deployment Checklist

### ✅ Code Setup
- [ ] Clone or extract the repository
- [ ] Review project structure
- [ ] Read `BUILD_SUMMARY.md` for overview
- [ ] Review `README.md` for features

### ✅ Frontend Setup (5 minutes)
```bash
cd frontend
npm install
cp .env.example .env
```
- [ ] Update `frontend/.env` with:
  - `VITE_API_URL=http://localhost:5000/api`
  - `VITE_FIREBASE_CONFIG_JSON={your firebase config}`

```bash
npm run dev
```
- [ ] Frontend running on http://localhost:3000

### ✅ Backend Setup (5 minutes)
```bash
cd backend
npm install
cp .env.example .env
```
- [ ] Update `backend/.env` with:
  - `MONGODB_URI=mongodb://localhost:27017/nyxen`
  - `GEMINI_API_KEY={your gemini key}`
  - `GEMINI_MODEL=gemini-1.5-pro`
  - `ELASTIC_HOST=http://localhost:9200`
  - `JWT_SECRET={generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"}`

```bash
npm run dev
```
- [ ] Backend running on http://localhost:5000

### ✅ Database Setup (Optional - for production-like testing)

#### Using MongoDB Local
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Windows: Download from mongodb.com
# Linux: apt-get install mongodb

# Start MongoDB
mongod
```

#### Using MongoDB Atlas (Free Tier)
1. [ ] Create account at mongodb.com
2. [ ] Create cluster
3. [ ] Get connection string
4. [ ] Update `MONGODB_URI` in backend .env

#### Using Elasticsearch Local
```bash
# Install Elasticsearch
# Using Docker (recommended):
docker run -d -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:8.8.0 \
  -e discovery.type=single-node \
  -e xpack.security.enabled=false
```

#### Using Elastic Cloud
1. [ ] Create account at elastic.co
2. [ ] Create deployment
3. [ ] Get connection details
4. [ ] Update `ELASTIC_*` variables in backend .env

### ✅ Free Deployment Setup

#### Get Gemini API Key
```bash
# 1. Go to Google AI Studio
# 2. Create a free API key
# 3. Add it to backend/.env as GEMINI_API_KEY
```

#### Deploy Backend to Render
```bash
# 1. Push the repository to GitHub
# 2. Create a Render Web Service
# 3. Use backend as the root directory
# 4. Set build command: npm ci && npm run build
# 5. Set start command: npm start
```

### ✅ Firebase Setup (Optional - For Production Auth)

1. [ ] Create Firebase project at firebase.google.com
2. [ ] Enable Authentication
3. [ ] Get Firebase config
4. [ ] Add to frontend/.env
5. [ ] Add to backend/.env

### ✅ Feature Testing (After Setup)

#### Authentication
- [ ] Visit http://localhost:3000
- [ ] See landing page
- [ ] Click "Get Started"
- [ ] Register new account
- [ ] Login with credentials

#### Dashboard
- [ ] View main dashboard
- [ ] See risk score cards
- [ ] View threat feed (mock data)
- [ ] See agent status

#### Threat Analytics
- [ ] Navigate to Threat Analytics
- [ ] View threat timeline chart
- [ ] View threat grid
- [ ] See event correlations

#### Financial Intelligence
- [ ] Navigate to Financial Intelligence
- [ ] View spending chart
- [ ] See category breakdown
- [ ] View predictions

#### Identity Protection
- [ ] Navigate to Identity Protection
- [ ] View login attempts
- [ ] Check connected devices
- [ ] See credential status

#### AI Explainability
- [ ] Navigate to AI Explainability
- [ ] See threat reasoning
- [ ] View confidence scores
- [ ] Check contributing factors

#### Simulation Lab
- [ ] Navigate to Simulation Lab
- [ ] Select a simulation
- [ ] View expected response
- [ ] See learning outcomes

#### Settings
- [ ] Navigate to Settings
- [ ] See security options
- [ ] Update preferences
- [ ] Check connected services

### ✅ API Testing (Backend Validation)

#### Test Auth Endpoints
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get Current User (use token from login)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me
```

#### Test Dashboard Endpoints
```bash
# Get Dashboard Data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard

# Get Threats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/dashboard/threats
```

#### Test Gemini Endpoints
```bash
# Analyze Threats
curl -X POST http://localhost:5000/api/gemini/analyze-threats \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"threats":[{"type":"phishing","description":"Suspicious email"}]}'
```

### ✅ Documentation Review

- [ ] Read `docs/API.md` - Understanding all endpoints
- [ ] Read `docs/SETUP.md` - Detailed setup instructions
- [ ] Read `docs/ARCHITECTURE.md` - System design
- [ ] Read `docs/DEPLOYMENT.md` - Production deployment
- [ ] Read `CONTRIBUTING.md` - If contributing code

### ✅ Deployment to Production

#### Option 1: Render + Vercel
1. [ ] Deploy backend to Render
2. [ ] Deploy frontend to Vercel
3. [ ] Set frontend `.env` to the backend URL
4. [ ] Test endpoints

#### Option 2: Docker Compose (Full Local)
```bash
# Create .env file
cat > .env << EOF
MONGO_PASSWORD=your_password
ELASTIC_PASSWORD=your_password
GEMINI_API_KEY=your_key
JWT_SECRET=your_secret
EOF

# Run all services
docker-compose up -d

# Verify
docker-compose ps
```

### ✅ Performance & Monitoring

- [ ] Check browser DevTools (Performance tab)
- [ ] Check backend logs for errors
- [ ] Monitor database queries
- [ ] Review Elastic indices
- [ ] Set up monitoring dashboard

### ✅ Security Checklist

- [ ] All .env files created (not in git)
- [ ] Database credentials secured
- [ ] API keys stored safely
- [ ] HTTPS enabled (production)
- [ ] CORS properly configured
- [ ] Security headers enabled (Helmet)
- [ ] Rate limiting considered
- [ ] Input validation in place

### ✅ Backup & Maintenance

- [ ] Set up MongoDB backup
- [ ] Configure log retention
- [ ] Monitor disk usage
- [ ] Plan scaling strategy
- [ ] Document deployment process

---

## 🎯 Success Indicators

You'll know everything is working when:

1. ✅ Frontend loads at http://localhost:3000
2. ✅ Login/register flow works
3. ✅ Dashboard displays with mock data
4. ✅ API endpoints respond with proper data
5. ✅ Gemini integration works (threat analysis)
6. ✅ Elastic integration works (event logging)
7. ✅ No console errors in browser
8. ✅ No server errors in backend logs

---

## 🆘 Troubleshooting

### Frontend Issues
- **Port 3000 in use:** `lsof -i :3000` then `kill -9 PID`
- **Module not found:** Delete `node_modules`, run `npm install`
- **API not connecting:** Check backend is running, VITE_API_URL correct
- **CSS not loading:** Clear browser cache (Ctrl+Shift+Delete)

### Backend Issues
- **Port 5000 in use:** `lsof -i :5000` then `kill -9 PID`
- **Database connection:** Check MongoDB running, MONGODB_URI correct
- **Gemini error:** Verify API key valid, quota available
- **Elastic error:** Check Elasticsearch running, ELASTIC_HOST correct

### Database Issues
- **MongoDB won't start:** Check data directory permissions
- **Connection timeout:** Verify connection string, network access
- **Authentication failed:** Confirm username/password

### Deployment Issues
- See `docs/DEPLOYMENT.md` - Troubleshooting section

---

## 📞 Getting Help

1. Check `docs/SETUP.md` - Setup troubleshooting
2. Check `docs/DEPLOYMENT.md` - Deployment issues
3. Review `README.md` - General overview
4. Review `CONTRIBUTING.md` - Contributing guidelines
5. Check API responses - API.md for expected formats

---

## 🎉 Next Steps

After successful setup:
1. Explore the dashboard
2. Test all features
3. Review the code
4. Customize for your needs
5. Deploy to production
6. Share with others!

---

**Happy deploying! 🚀**
