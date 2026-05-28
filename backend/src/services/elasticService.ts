import { indexEvent, searchEvents } from '../config/elastic.js'
import logger from '../utils/logger.js'

/**
 * Elastic Service
 * Handle event logging, anomaly detection, and correlation
 */

/**
 * Log Event to Elastic
 */
export async function logEvent(
  userId: string,
  eventType: string,
  eventData: any
) {
  try {
    const event = {
      userId,
      eventType,
      timestamp: new Date(),
      data: eventData,
    }

    const result = await indexEvent(eventType, event)
    logger.debug(`Event logged to Elastic: ${eventType}`, { userId })

    return result?._id || null
  } catch (error) {
    logger.error('Failed to log event to Elastic:', error)
    return null
  }
}

/**
 * Detect Anomalies
 */
export async function detectAnomalies(userId: string, timeRange: string = '24h') {
  try {
    const query = {
      query: {
        bool: {
          must: [
            { term: { userId } },
            {
              range: {
                timestamp: { gte: `now-${timeRange}` },
              },
            },
          ],
        },
      },
      aggs: {
        eventTypes: {
          terms: { field: 'eventType' },
        },
      },
    }

    const results = await searchEvents('events', query)
    logger.debug('Anomaly detection completed', { userId })

    return results
  } catch (error) {
    logger.error('Failed to detect anomalies:', error)
    return null
  }
}

/**
 * Correlate Events
 */
export async function correlateEvents(userId: string, threatTypes: string[]) {
  try {
    const query = {
      query: {
        bool: {
          must: [
            { term: { userId } },
            { terms: { eventType: threatTypes } },
            {
              range: {
                timestamp: { gte: 'now-7d' },
              },
            },
          ],
        },
      },
      aggs: {
        timeline: {
          date_histogram: {
            field: 'timestamp',
            interval: 'hour',
          },
        },
        correlations: {
          terms: { field: 'data.ipAddress', size: 10 },
        },
      },
    }

    const results = await searchEvents('threats', query)
    logger.debug('Event correlation completed', { userId })

    return results
  } catch (error) {
    logger.error('Failed to correlate events:', error)
    return null
  }
}

/**
 * Get Real-time Dashboard Data
 */
export async function getDashboardData(userId: string) {
  try {
    const threats = await searchEvents('threats', {
      query: {
        bool: {
          must: [
            { term: { userId } },
            { terms: { status: ['detected', 'acknowledged'] } },
            { range: { detectedAt: { gte: 'now-30d' } } },
          ],
        },
      },
      size: 100,
    })

    const anomalies = await detectAnomalies(userId, '7d')

    return {
      threats: threats?.hits?.hits || [],
      anomalies: anomalies?.aggregations || {},
      timestamp: new Date(),
    }
  } catch (error) {
    logger.error('Failed to get dashboard data:', error)
    return null
  }
}

/**
 * Search Threat Events
 */
export async function searchThreats(
  userId: string,
  filters: {
    type?: string
    severity?: string
    status?: string
    dateRange?: string
  }
) {
  try {
    const must = [{ term: { userId } }]

    if (filters.type) must.push({ term: { type: filters.type } })
    if (filters.severity) must.push({ term: { severity: filters.severity } })
    if (filters.status) must.push({ term: { status: filters.status } })

    const query = {
      query: {
        bool: { must },
      },
      sort: [{ detectedAt: { order: 'desc' } }],
      size: 100,
    }

    const results = await searchEvents('threats', query)
    return results?.hits?.hits || []
  } catch (error) {
    logger.error('Failed to search threats:', error)
    return []
  }
}
