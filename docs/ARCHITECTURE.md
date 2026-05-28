# Nyxen Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           User Clients                               │
│                         (Web, Mobile)                               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  CDN/Cache  │
                    └──────┬──────┘
                           │
┌────────────────────────────▼──────────────────────────────────────┐
│                     Firebase Hosting                               │
│                    (Frontend Deployment)                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React + Vite Frontend (SPA)                │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │  Components │ Pages │ Services │ Store │ Hooks  │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │              Tailwind CSS + Framer Motion              │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬──────────────────────────────────────┘
                           │
            API Gateway / Load Balancer
                           │
┌────────────────────────────▼──────────────────────────────────────┐
│                    Google Cloud Run / Kubernetes                   │
│         ┌──────────────────────────────────────────────┐         │
│         │         Express.js Backend (Node.js)         │         │
│         │  ┌────────────────────────────────────────┐ │         │
│         │  │  Routes │ Controllers │ Middleware     │ │         │
│         │  │  ┌──────────────────────────────────┐ │ │         │
│         │  │  │   REST API Endpoints             │ │ │         │
│         │  │  │ /auth /dashboard /gemini         │ │ │         │
│         │  │  │ /elastic /financial /identity    │ │ │         │
│         │  │  └──────────────────────────────────┘ │ │         │
│         │  └────────────────────────────────────────┘ │         │
│         │  ┌────────────────────────────────────────┐ │         │
│         │  │      Service Layer                      │ │         │
│         │  │  ┌──────────────────────────────────┐ │ │         │
│         │  │  │ • Gemini AI Service              │ │ │         │
│         │  │  │ • Elastic Service                │ │ │         │
│         │  │  │ • Auth Service                   │ │ │         │
│         │  │  │ • Threat Detection Service       │ │ │         │
│         │  │  │ • Behavior Analysis Service      │ │ │         │
│         │  │  └──────────────────────────────────┘ │ │         │
│         │  └────────────────────────────────────────┘ │         │
│         └──────────────────────────────────────────────┘         │
└────────────────────┬──────────────────────────────┬──────────────┘
                     │                              │
                     ▼                              ▼
         ┌──────────────────────┐      ┌──────────────────────┐
         │   Google Gemini API  │      │  Elastic Stack       │
         │   (AI Analysis)      │      │  (Event Analytics)   │
         │                      │      │                      │
         │ • Threat Analysis    │      │ • Event Indexing     │
         │ • Reasoning          │      │ • Anomaly Detection  │
         │ • Explanations       │      │ • Correlation        │
         │ • Recommendations    │      │ • Real-time Search   │
         └──────────────────────┘      └──────────────────────┘
                     │                              │
                     └──────────────┬───────────────┘
                                    ▼
                     ┌──────────────────────────┐
                     │     Data Layer           │
                     │  ┌────────────────────┐ │
                     │  │   MongoDB Atlas    │ │
                     │  │                    │ │
                     │  │ • Users            │ │
                     │  │ • Threats          │ │
                     │  │ • Transactions     │ │
                     │  │ • Credentials      │ │
                     │  │ • Login Attempts   │ │
                     │  │ • Audit Logs       │ │
                     │  └────────────────────┘ │
                     └──────────────────────────┘

```

## Component Hierarchy

### Frontend Components

```
App
├── LandingPage
│   ├── HeroSection
│   ├── FeaturesGrid
│   ├── StatisticsSection
│   └── CTASection
├── Login
│   ├── LoginForm
│   └── SignupLink
├── DashboardLayout
│   ├── Sidebar
│   │   ├── NavMenu
│   │   └── UserProfile
│   ├── Header
│   │   ├── UserInfo
│   │   └── NotificationBell
│   └── MainContent
│       ├── Dashboard
│       │   ├── RiskScoreCards
│       │   ├── ThreatFeed
│       │   ├── AgentStatus
│       │   └── QuickActions
│       ├── ThreatAnalytics
│       │   ├── ThreatTimeline
│       │   ├── ThreatGrid
│       │   └── Recommendations
│       ├── FinancialIntelligence
│       │   ├── SpendingChart
│       │   ├── CategoryBreakdown
│       │   └── Predictions
│       ├── IdentityProtection
│       │   ├── LoginAttempts
│       │   ├── DeviceMonitoring
│       │   └── CredentialStatus
│       ├── SimulationLab
│       │   ├── SimulationGrid
│       │   └── SimulationResults
│       ├── AIExplainability
│       │   ├── ExplanationCards
│       │   ├── ConfidenceBreakdown
│       │   └── ReasoningChain
│       └── Settings
│           ├── AccountSettings
│           ├── SecuritySettings
│           ├── NotificationPrefs
│           └── ConnectedServices

UI Components (Reusable)
├── GlassCard
├── NeonButton
├── RiskBadge
├── StatCard
├── LoadingSpinner
├── Toast
└── Charts (Recharts)
    ├── LineChart
    ├── AreaChart
    ├── BarChart
    └── PieChart
```

### Backend Services

```
Express Server
├── Middleware Layer
│   ├── Authentication (JWT)
│   ├── Authorization (Role-based)
│   ├── CORS
│   ├── Compression
│   ├── Helmet (Security)
│   └── Error Handling
├── Route Layer
│   ├── /auth
│   │   ├── POST /register
│   │   ├── POST /login
│   │   ├── GET /me
│   │   └── POST /logout
│   ├── /dashboard
│   │   ├── GET /dashboard
│   │   ├── GET /threats
│   │   ├── GET /risk-scores
│   │   └── GET /anomalies
│   ├── /gemini
│   │   ├── POST /analyze-threats
│   │   ├── POST /explain/:threatId
│   │   └── POST /recommendations/:threatId
│   ├── /elastic
│   │   ├── POST /search
│   │   ├── GET /anomalies
│   │   └── GET /correlations
│   ├── /financial
│   │   ├── GET /analysis
│   │   ├── GET /spending
│   │   └── GET /predictions
│   ├── /identity
│   │   ├── GET /login-attempts
│   │   ├── GET /devices
│   │   └── GET /credentials
│   └── /simulate
│       ├── POST /phishing
│       ├── POST /account-takeover
│       └── POST /financial-fraud
├── Service Layer
│   ├── AuthService
│   │   ├── Register
│   │   ├── Login
│   │   └── Token Management
│   ├── GeminiService
│   │   ├── analyzeThreat()
│   │   ├── explainThreat()
│   │   ├── generateRecommendations()
│   │   └── analyzeBehavioralPatterns()
│   ├── ElasticService
│   │   ├── logEvent()
│   │   ├── detectAnomalies()
│   │   ├── correlateEvents()
│   │   └── searchThreats()
│   ├── ThreatDetectionService
│   │   ├── Phishing Detection
│   │   ├── Fraud Detection
│   │   ├── Account Takeover Detection
│   │   └── Behavioral Analysis
│   └── AnalyticsService
│       ├── Calculate Risk Scores
│       ├── Generate Insights
│       └── Predictive Analysis
├── Model Layer (MongoDB)
│   ├── User
│   ├── Threat
│   ├── Transaction
│   ├── LoginAttempt
│   ├── Credential
│   └── AuditLog
└── Integration Layer
    ├── Google Gemini API
    ├── Elastic Stack
    ├── Firebase Auth
    ├── Google Cloud Logging
    └── External APIs
```

## Data Flow

### Threat Detection Flow

```
User Action (Login)
        │
        ▼
─────────────────────────────────────
│ Capture Event (IP, Device, etc.)  │
─────────────────────────────────────
        │
        ▼
─────────────────────────────────────
│ Log to Elastic                     │
─────────────────────────────────────
        │
        ▼
─────────────────────────────────────
│ Anomaly Detection Engine           │
│ (Compare to historical patterns)   │
─────────────────────────────────────
        │
        ├─── Normal? ──→ Store & Monitor
        │
        └─── Anomalous?
             │
             ▼
          ─────────────────────────────────────
          │ Correlation Engine                 │
          │ (Find related events)              │
          ─────────────────────────────────────
             │
             ▼
          ─────────────────────────────────────
          │ Gemini AI Analysis                 │
          │ (Understand threat)                │
          ─────────────────────────────────────
             │
             ├─── Threat Detected
             │    │
             │    ▼
             │ ─────────────────────────────────────
             │ │ Create Threat Record             │
             │ │ Store in MongoDB                 │
             │ ─────────────────────────────────────
             │    │
             │    ▼
             │ ─────────────────────────────────────
             │ │ Generate Recommendations         │
             │ │ (via Gemini)                     │
             │ ─────────────────────────────────────
             │    │
             │    ▼
             │ ─────────────────────────────────────
             │ │ Send to Frontend                 │
             │ │ Real-time Update (WebSocket)    │
             │ ─────────────────────────────────────
             │
             └─── False Positive? ──→ Store & Learn
```

### Financial Analysis Flow

```
Financial Transaction
        │
        ▼
─────────────────────────────────────
│ Store in MongoDB                   │
│ (Transactions collection)          │
─────────────────────────────────────
        │
        ▼
─────────────────────────────────────
│ Pattern Analysis                   │
│ • Category breakdown               │
│ • Spending trends                  │
│ • Anomaly scoring                  │
─────────────────────────────────────
        │
        ▼
─────────────────────────────────────
│ Gemini AI Analysis                 │
│ • Predict balance                  │
│ • Detect lifestyle creep           │
│ • Identify forgotten subscriptions  │
─────────────────────────────────────
        │
        ▼
─────────────────────────────────────
│ Generate Insights                  │
│ • Budget recommendations           │
│ • Spending alerts                  │
│ • Savings predictions              │
─────────────────────────────────────
        │
        ▼
─────────────────────────────────────
│ Frontend Display                   │
│ • Charts & Statistics              │
│ • AI Recommendations               │
│ • Actionable Insights              │
─────────────────────────────────────
```

## Database Schema

### MongoDB Collections

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  plan: String, // free, pro, enterprise
  riskScore: Number,
  identityScore: Number,
  financialRiskScore: Number,
  lastLogin: Date,
  settings: {
    twoFactorEnabled: Boolean,
    theme: String
  },
  createdAt: Date,
  updatedAt: Date
}

// Threats Collection
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // phishing, fraud, etc.
  severity: String,
  description: String,
  confidence: Number,
  status: String, // detected, acknowledged, resolved
  gemminiAnalysis: {
    reasoning: String,
    predictedImpact: String,
    recommendedActions: [String]
  },
  correlatedThreats: [ObjectId],
  evidence: {
    ipAddresses: [String],
    devices: [String],
    locations: [String]
  },
  detectedAt: Date,
  resolvedAt: Date
}

// Transactions Collection
{
  _id: ObjectId,
  userId: ObjectId,
  amount: Number,
  category: String,
  merchant: String,
  anomalyScore: Number,
  flagged: Boolean,
  transactionDate: Date,
  createdAt: Date
}

// Login Attempts Collection
{
  _id: ObjectId,
  userId: ObjectId,
  ipAddress: String,
  deviceInfo: String,
  geoLocation: {
    country: String,
    city: String,
    latitude: Number,
    longitude: Number
  },
  isAnomalous: Boolean,
  anomalyScore: Number,
  success: Boolean,
  attemptAt: Date
}
```

### Elastic Indices

```
nyxen-threats/
├── _doc
├── mappings
│   ├── properties
│   │   ├── userId: keyword
│   │   ├── type: keyword
│   │   ├── severity: keyword
│   │   ├── confidence: integer
│   │   ├── detectedAt: date
│   │   ├── status: keyword
│   │   └── data: object (dynamic)

nyxen-events/
├── _doc
├── mappings
│   ├── properties
│   │   ├── userId: keyword
│   │   ├── eventType: keyword
│   │   ├── timestamp: date
│   │   ├── data: object
│   │   ├── metadata: object
│   │   └── tags: keyword

nyxen-anomalies/
├── _doc
├── mappings
│   ├── properties
│   │   ├── userId: keyword
│   │   ├── anomalyType: keyword
│   │   ├── score: float
│   │   ├── detectedAt: date
│   │   └── details: object
```

## Security Architecture

### Authentication Flow

```
User Login
    │
    ▼
─────────────────────────────────────
│ Verify Credentials                 │
│ (Email + Password Hash)            │
─────────────────────────────────────
    │
    ├─── Invalid? ──→ Return 401
    │
    └─── Valid?
         │
         ▼
      ─────────────────────────────────────
      │ Generate JWT Token               │
      │ (Header.Payload.Signature)       │
      ─────────────────────────────────────
         │
         ▼
      ─────────────────────────────────────
      │ Return Token to Client           │
      │ Store in localStorage            │
      ─────────────────────────────────────
         │
         ▼
      Future API Requests
         │
         ▼
      ─────────────────────────────────────
      │ Include Token in Authorization   │
      │ Bearer <token>                   │
      ─────────────────────────────────────
         │
         ▼
      ─────────────────────────────────────
      │ Verify Signature                 │
      │ Check Expiration                 │
      ─────────────────────────────────────
         │
         ├─── Invalid? ──→ Return 401
         │
         └─── Valid? ──→ Process Request
```

---

**This architecture is production-ready and scalable!**
