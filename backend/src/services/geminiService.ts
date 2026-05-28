import { GoogleGenerativeAI } from '@google/generative-ai'
import config from '../config/env.js'
import logger from './logger.js'

/**
 * Gemini AI Service
 * Interact with Google Gemini API for threat analysis and explanation
 */

let genAI: GoogleGenerativeAI | null = null

function initializeGemini() {
  if (!config.geminiApiKey) {
    logger.warn('⚠ Gemini API key not configured')
    return null
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.geminiApiKey)
  }

  return genAI
}

/**
 * Analyze Threats with Gemini
 */
export async function analyzeThreat(threatData: {
  type: string
  description: string
  context: any
}) {
  try {
    const ai = initializeGemini()
    if (!ai) throw new Error('Gemini not initialized')

    const model = ai.getGenerativeModel({ model: config.geminiModel })

    const prompt = `
You are a cybersecurity expert. Analyze the following threat and provide:
1. Why this is a threat
2. Confidence score (0-100)
3. Predicted impact
4. Recommended actions

Threat Type: ${threatData.type}
Description: ${threatData.description}
Context: ${JSON.stringify(threatData.context)}

Respond in JSON format.
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const analysis = JSON.parse(responseText)
    logger.debug('Threat analyzed with Gemini', { type: threatData.type })

    return analysis
  } catch (error) {
    logger.error('Failed to analyze threat with Gemini:', error)
    return null
  }
}

/**
 * Generate Explanation for Threat
 */
export async function explainThreat(threatId: string, threatDetails: any) {
  try {
    const ai = initializeGemini()
    if (!ai) throw new Error('Gemini not initialized')

    const model = ai.getGenerativeModel({ model: config.geminiModel })

    const prompt = `
Explain why the following threat was detected in simple, non-technical terms:

Threat Details: ${JSON.stringify(threatDetails)}

Include:
1. Simple explanation of what happened
2. Why this matters
3. What actions the user should take
4. How to prevent it in the future
`

    const result = await model.generateContent(prompt)
    const explanation = result.response.text()

    logger.debug('Threat explanation generated', { threatId })
    return explanation
  } catch (error) {
    logger.error('Failed to generate threat explanation:', error)
    return null
  }
}

/**
 * Generate Recommendations
 */
export async function generateRecommendations(threatType: string, userContext: any) {
  try {
    const ai = initializeGemini()
    if (!ai) throw new Error('Gemini not initialized')

    const model = ai.getGenerativeModel({ model: config.geminiModel })

    const prompt = `
Based on this threat, provide specific, actionable recommendations:

Threat Type: ${threatType}
User Context: ${JSON.stringify(userContext)}

Provide recommendations as a JSON array with:
- action: specific action to take
- priority: critical/high/medium/low
- timeframe: when to do it
- details: detailed steps
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const recommendations = JSON.parse(responseText)
    logger.debug('Recommendations generated', { threatType })

    return recommendations
  } catch (error) {
    logger.error('Failed to generate recommendations:', error)
    return null
  }
}

/**
 * Analyze Behavioral Patterns
 */
export async function analyzeBehavioralPatterns(userActivity: any) {
  try {
    const ai = initializeGemini()
    if (!ai) throw new Error('Gemini not initialized')

    const model = ai.getGenerativeModel({ model: config.geminiModel })

    const prompt = `
Analyze the following user activity for behavioral anomalies and predict risks:

User Activity: ${JSON.stringify(userActivity)}

Provide analysis in JSON format with:
- anomalies: detected behavioral changes
- riskLevel: low/medium/high/critical
- predictions: predicted future risks
- recommendations: preventive actions
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const analysis = JSON.parse(responseText)
    logger.debug('Behavioral analysis completed')

    return analysis
  } catch (error) {
    logger.error('Failed to analyze behavioral patterns:', error)
    return null
  }
}

export { GoogleGenerativeAI }
