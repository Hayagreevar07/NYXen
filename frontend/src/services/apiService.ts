import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * API Service
 * Centralized API client with interceptors
 */
export const apiService = {
  // Auth
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    client.post('/auth/register', { email, password }),
  logout: () => client.post('/auth/logout'),

  // Dashboard
  getDashboardData: () => client.get('/dashboard'),
  getThreats: () => client.get('/threats'),
  getAnomalies: () => client.get('/anomalies'),
  getRiskScores: () => client.get('/risk-scores'),

  // Gemini Analysis
  analyzeThreats: (data: any) => client.post('/gemini/analyze-threats', data),
  explainThreat: (threatId: string) => client.post(`/gemini/explain/${threatId}`),
  generateRecommendations: (threatId: string) =>
    client.post(`/gemini/recommendations/${threatId}`),

  // Elastic
  searchEvents: (query: string) => client.post('/elastic/search', { query }),
  getAnomalyDetection: () => client.get('/elastic/anomalies'),
  getEventCorrelation: () => client.get('/elastic/correlations'),

  // Financial Intelligence
  getFinancialAnalysis: () => client.get('/financial/analysis'),
  getSpendingPatterns: () => client.get('/financial/spending'),
  getPredictions: () => client.get('/financial/predictions'),

  // Identity Protection
  getLoginAttempts: () => client.get('/identity/login-attempts'),
  getDeviceBehavior: () => client.get('/identity/devices'),
  getCredentialStatus: () => client.get('/identity/credentials'),

  // Simulation
  simulatePhishing: (config: any) => client.post('/simulate/phishing', config),
  simulateAccountTakeover: (config: any) =>
    client.post('/simulate/account-takeover', config),
  simulateFinancialFraud: (config: any) =>
    client.post('/simulate/financial-fraud', config),
}

export default apiService
