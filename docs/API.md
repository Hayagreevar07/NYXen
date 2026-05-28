# Nyxen API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

All responses are in JSON format:

```json
{
  "data": {},
  "error": null,
  "timestamp": "2024-05-28T10:30:00Z"
}
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "plan": "free",
    "riskScore": 0,
    "createdAt": "2024-05-28T10:30:00Z"
  },
  "token": "eyJhbGc..."
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** Same as register

### Get Current User

```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "plan": "pro",
  "riskScore": 25,
  "lastLogin": "2024-05-28T10:30:00Z"
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer YOUR_TOKEN
```

---

## Dashboard Endpoints

### Get Dashboard Data

```http
GET /dashboard
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "user": { ... },
  "risks": {
    "overall": 25,
    "identity": 78,
    "financial": 42
  },
  "threats": [
    {
      "id": "threat_id",
      "type": "phishing",
      "severity": "high",
      "description": "Suspicious email detected",
      "confidence": 94,
      "status": "detected"
    }
  ],
  "elastic": { ... }
}
```

### Get Threats

```http
GET /threats?type=phishing&severity=high&status=detected
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**
- `type` - Threat type (optional)
- `severity` - critical, high, medium, low
- `status` - detected, acknowledged, resolved

**Response:**
```json
[
  {
    "_id": "threat_id",
    "type": "phishing",
    "severity": "high",
    "description": "...",
    "confidence": 94,
    "detectedAt": "2024-05-28T10:30:00Z"
  }
]
```

### Get Risk Scores

```http
GET /risk-scores
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "overall": 25,
  "identity": 78,
  "financial": 42,
  "lastUpdated": "2024-05-28T10:30:00Z"
}
```

### Get Anomalies

```http
GET /anomalies
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
[
  {
    "id": "anom_1",
    "type": "login",
    "score": 78,
    "description": "Unusual login location",
    "timestamp": "2024-05-28T10:30:00Z"
  }
]
```

---

## Gemini AI Endpoints

### Analyze Threats

```http
POST /gemini/analyze-threats
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "threats": [
    {
      "type": "phishing",
      "description": "Suspicious email from unknown sender",
      "context": {
        "sender": "attacker@evil.com",
        "subject": "Urgent action required"
      }
    }
  ]
}
```

**Response:**
```json
[
  {
    "type": "phishing",
    "confidence": 94,
    "reasoning": "Multiple phishing indicators detected",
    "predictedImpact": "High risk of credential compromise",
    "recommendedActions": [
      "Mark as spam",
      "Report to security team",
      "Enable MFA"
    ]
  }
]
```

### Explain Threat

```http
POST /gemini/explain/:threatId
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "threatDetails": {
    "type": "phishing",
    "ipAddress": "1.2.3.4",
    "location": "Unknown location",
    "confidence": 94
  }
}
```

**Response:**
```json
{
  "explanation": "This threat was detected because... [detailed explanation in plain English]"
}
```

### Generate Recommendations

```http
POST /gemini/recommendations/:threatId
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "threatType": "account_takeover"
}
```

**Response:**
```json
[
  {
    "action": "Enable two-factor authentication",
    "priority": "critical",
    "timeframe": "Immediately",
    "details": "Go to Settings > Security > 2FA"
  },
  {
    "action": "Review recent login activity",
    "priority": "high",
    "timeframe": "Within 1 hour",
    "details": "Check for unauthorized access attempts"
  }
]
```

---

## Elastic Endpoints

### Search Events

```http
POST /elastic/search
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "query": "phishing attack last week"
}
```

### Get Anomalies

```http
GET /elastic/anomalies
Authorization: Bearer YOUR_TOKEN
```

### Get Event Correlations

```http
GET /elastic/correlations
Authorization: Bearer YOUR_TOKEN
```

---

## Financial Endpoints

### Get Financial Analysis

```http
GET /financial/analysis?period=30d
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "totalSpending": 5200,
  "avgTransaction": 185,
  "transactionCount": 28,
  "period": "30d"
}
```

### Get Spending Patterns

```http
GET /financial/spending
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "byCategory": {
    "groceries": 620,
    "dining": 480,
    "shopping": 890,
    "subscriptions": 285
  },
  "transactions": [...]
}
```

### Get Predictions

```http
GET /financial/predictions
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "predictedMonthlySpending": 5200,
  "savingsGoalRisk": "medium",
  "predictedBalance": 3450,
  "recommendations": [...]
}
```

---

## Identity Protection Endpoints

### Get Login Attempts

```http
GET /identity/login-attempts
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
[
  {
    "location": "New York, USA",
    "device": "Chrome on Windows",
    "time": "2 hours ago",
    "status": "verified"
  }
]
```

### Get Connected Devices

```http
GET /identity/devices
Authorization: Bearer YOUR_TOKEN
```

### Get Credential Status

```http
GET /identity/credentials
Authorization: Bearer YOUR_TOKEN
```

---

## Simulation Endpoints

### Simulate Phishing Attack

```http
POST /simulate/phishing
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "config": {
    "complexity": "medium",
    "target": "email"
  }
}
```

**Response:**
```json
{
  "id": "sim_123",
  "type": "phishing",
  "status": "completed",
  "threatDetected": true,
  "detectionTime": 250,
  "confidence": 98,
  "reasoning": "Email matched known phishing patterns"
}
```

### Simulate Account Takeover

```http
POST /simulate/account-takeover
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "config": { ... }
}
```

### Simulate Financial Fraud

```http
POST /simulate/financial-fraud
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "config": { ... }
}
```

---

## Rate Limiting

Coming in v1.1:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated endpoints

## Webhooks

Coming in v1.2:
- Threat detection events
- Risk score changes
- Agent activity updates

---

**Last Updated:** 2024-05-28
