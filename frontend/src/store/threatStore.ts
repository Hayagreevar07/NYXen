import { create } from 'zustand'

export interface Threat {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  timestamp: string
  resolved: boolean
  confidence: number
}

export interface AnomalyData {
  id: string
  category: string
  score: number
  description: string
  timestamp: string
  details: Record<string, any>
}

interface ThreatState {
  threats: Threat[]
  anomalies: AnomalyData[]
  riskScore: number
  identityScore: number
  financialRiskScore: number
  setThreats: (threats: Threat[]) => void
  addThreat: (threat: Threat) => void
  setAnomalies: (anomalies: AnomalyData[]) => void
  setRiskScores: (scores: { risk: number; identity: number; financial: number }) => void
}

/**
 * Threat Store
 * Global threat and anomaly state management
 */
export const useThreatStore = create<ThreatState>((set) => ({
  threats: [],
  anomalies: [],
  riskScore: 25,
  identityScore: 78,
  financialRiskScore: 42,

  setThreats: (threats) => set({ threats }),
  addThreat: (threat) => set((state) => ({ threats: [threat, ...state.threats] })),
  setAnomalies: (anomalies) => set({ anomalies }),
  setRiskScores: (scores) =>
    set({
      riskScore: scores.risk,
      identityScore: scores.identity,
      financialRiskScore: scores.financial,
    }),
}))
