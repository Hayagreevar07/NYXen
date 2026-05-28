# Nyxen - AI-Powered Behavioral Intelligence & Protection Platform

**An autonomous cybersecurity and financial intelligence system powered by Google Gemini, Elastic, MongoDB, and Firebase Auth.**

![Status](https://img.shields.io/badge/status-production--grade-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 🎯 Overview

Nyxen is a full-stack AI platform that combines:

- **Autonomous Threat Detection**: Predicts and detects phishing, fraud, account takeovers, and behavioral anomalies
- **Behavioral Intelligence**: Analyzes financial and identity patterns to identify risks before they escalate
- **Autonomous Response Engine**: Automatically generates defensive actions and recommendations
- **Explainable AI**: Gemini-powered explanations of detected threats and recommended actions
- **Real-time Analytics**: Elastic-powered event correlation and anomaly detection

## 🏗️ Architecture

```
Nyxen/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Main application pages
│   │   ├── services/           # API client
│   │   ├── store/              # Zustand state management
│   │   ├── styles/             # Global styles
│   │   └── utils/              # Helper functions
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/             # Database, Elastic, env
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # Gemini, Elastic services
│   │   ├── middleware/         # Auth, CORS, error handling
│   │   ├── utils/              # Logger, JWT utilities
│   │   ├── app.ts              # Express app setup
│   │   └── index.ts            # Server entry point
│   ├── tsconfig.json
│   └── package.json
│
└── docs/                        # Documentation
    ├── API.md                   # API documentation
    ├── SETUP.md                 # Setup instructions
    └── DEPLOYMENT.md            # Deployment guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 5+
- Google Gemini API Key
- Elastic instance
- Firebase project
- MongoDB Atlas account or local MongoDB
- Vercel or Render account for deployment

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:3000`

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Environment Configuration

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
```

**Backend** (`.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nyxen
GEMINI_API_KEY=your_gemini_key
ELASTIC_HOST=https://localhost:9200
ELASTIC_PASSWORD=your_password
```

## 📊 Key Features

### 1. **Real-time Security Dashboard**
- Live threat detection feed
- Risk scores (overall, identity, financial)
- Autonomous agent status monitoring
- Active alerts and anomalies

### 2. **Threat Analytics**
- 24-hour threat timeline visualization
- Threat type distribution
- Event correlations
- AI-powered recommendations

### 3. **Financial Intelligence**
- Spending pattern analysis
- Subscription leak detection
- Lifestyle creep monitoring
- End-of-month balance predictions

### 4. **Identity Protection**
- Suspicious login detection
- Device behavior monitoring
- Credential exposure tracking
- Cross-platform anomaly detection

### 5. **AI Simulation Lab**
- Test phishing attack scenarios
- Simulate account takeover attempts
- Financial fraud testing
- Social engineering simulations

### 6. **AI Explainability**
- Understand threat detection reasoning
- Confidence score breakdown
- Impact predictions
- Detailed AI analysis

## 🔌 Autonomous Agents

Nyxen runs 6 autonomous agents:

1. **Financial Intelligence Agent**
   - Analyzes spending patterns
   - Detects lifestyle creep
   - Predicts balance and fraud risks

2. **Threat Correlation Agent**
   - Correlates events across platforms
   - Identifies attack patterns
   - Detects behavioral drift

3. **Identity Protection Agent**
   - Monitors login attempts
   - Tracks device behavior
   - Detects impersonation

4. **Behavioral Drift Agent**
   - Analyzes anomalies
   - Predicts future risks
   - Generates risk scores

5. **Autonomous Response Engine**
   - Recommends protective actions
   - Suggests MFA enablement
   - Simulates threat mitigation

6. **Explainability Agent**
   - Generates AI reasoning
   - Explains threat detection
   - Breaks down confidence levels

## 🧠 Gemini AI Integration

Nyxen uses Google Gemini API for:

- **Threat Analysis**: Analyze security events and generate insights
- **Explainability**: Explain why threats were detected
- **Recommendations**: Generate actionable defensive recommendations
- **Behavioral Analysis**: Understand user behavior patterns

## 📊 Elastic Stack Integration

Nyxen uses Elastic for:

- **Event Logging**: Log all security events
- **Anomaly Detection**: Detect behavioral anomalies
- **Correlation**: Find event relationships
- **Real-time Analytics**: Dashboard data
- **Threat Indexing**: Fast threat searching

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Firebase Integration**: Optional enterprise auth
- **Password Hashing**: bcryptjs with salts
- **HTTPS Ready**: Helmet security headers
- **Rate Limiting**: Coming soon
- **Audit Logging**: All actions logged

## 📱 Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons

### Backend
- Express.js
- Node.js
- MongoDB
- JWT
- Google Gemini API
- Elastic Stack

### Infrastructure
- Render / Vercel / Docker
- Firebase
- Elastic Cloud
- MongoDB Atlas

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/threats` - List threats
- `GET /api/risk-scores` - Get risk scores
- `GET /api/anomalies` - Get anomalies

### Gemini AI
- `POST /api/gemini/analyze-threats` - Analyze threats
- `POST /api/gemini/explain/:threatId` - Explain threat
- `POST /api/gemini/recommendations/:threatId` - Get recommendations

### Elastic
- `POST /api/elastic/search` - Search events
- `GET /api/elastic/anomalies` - Get anomalies
- `GET /api/elastic/correlations` - Get correlations

### Financial
- `GET /api/financial/analysis` - Get analysis
- `GET /api/financial/spending` - Get spending data
- `GET /api/financial/predictions` - Get predictions

### Identity
- `GET /api/identity/login-attempts` - Get login attempts
- `GET /api/identity/devices` - Get devices
- `GET /api/identity/credentials` - Get credentials

### Simulation
- `POST /api/simulate/phishing` - Simulate phishing
- `POST /api/simulate/account-takeover` - Simulate takeover
- `POST /api/simulate/financial-fraud` - Simulate fraud

## 🎨 UI/UX Design

- **Cybersecurity Theme**: Neon colors, glassmorphism
- **Dark Mode**: Optimized for 24/7 monitoring
- **Real-time Visualizations**: Animated threat feeds
- **Responsive Design**: Mobile-friendly layouts
- **Smooth Animations**: Framer Motion interactions

### Color Palette
- Primary Neon Cyan: `#00d9ff`
- Secondary Purple: `#a855f7`
- Accent Pink: `#ec4899`
- Success Green: `#00ff41`

## 🚀 Deployment

### Free Deployment

```bash
# Backend: Render (free tier)
# 1. Push the repo to GitHub
# 2. Create a new Web Service on Render
# 3. Root directory: backend
# 4. Build command: npm ci && npm run build
# 5. Start command: npm start

# Frontend: Vercel (free tier)
# 1. Import the repo into Vercel
# 2. Root directory: frontend
# 3. Set VITE_API_URL to your Render backend URL
# 4. Deploy
```

### Frontend (Vercel)

```bash
# Build
npm run build

# Deploy
vercel deploy dist
```

## 📈 Monitoring

- Application metrics via Elastic
- Platform logging via Render, Vercel, or Docker
- Performance monitoring
- Error tracking

## 🧪 Testing

```bash
# Frontend
npm test

# Backend
npm test
```

## 📝 Documentation

- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **Live Demo**: https://nyxen.ai (coming soon)
- **GitHub**: https://github.com/yourusername/nyxen
- **Documentation**: https://docs.nyxen.ai

## 💬 Support

- GitHub Issues: Report bugs and feature requests
- Discussions: Ask questions and share ideas
- Email: support@nyxen.ai

## ⚠️ Security Notice

Nyxen is a security platform. Always follow responsible disclosure practices and obtain proper authorization before testing security features on production systems.

---

**Built with ❤️ for secure AI automation**
