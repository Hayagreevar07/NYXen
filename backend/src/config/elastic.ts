import { Client as ElasticClient } from '@elastic/elasticsearch'
import config from './env.js'
import logger from '../utils/logger.js'

let elasticClient: ElasticClient | null = null

/**
 * Initialize Elastic Client
 */
export function initializeElastic() {
  if (!config.elasticHost) {
    logger.warn('⚠ Elastic configuration missing, skipping initialization')
    return null
  }

  try {
    elasticClient = new ElasticClient({
      node: config.elasticHost,
      auth: {
        username: config.elasticUsername,
        password: config.elasticPassword,
      },
      tls: {
        rejectUnauthorized: false, // For dev/testing only
      },
    })

    logger.info('✓ Elastic client initialized')
    return elasticClient
  } catch (error) {
    logger.error('✗ Failed to initialize Elastic client:', error)
    return null
  }
}

/**
 * Get Elastic Client
 */
export function getElasticClient() {
  if (!elasticClient) {
    initializeElastic()
  }
  return elasticClient
}

/**
 * Index Event in Elastic
 */
export async function indexEvent(index: string, body: any) {
  try {
    const client = getElasticClient()
    if (!client) return null

    const response = await client.index({
      index: `${config.elasticIndexPrefix}-${index}`,
      body,
    })

    logger.debug(`Event indexed: ${index}`, { id: response._id })
    return response
  } catch (error) {
    logger.error('Failed to index event in Elastic:', error)
    return null
  }
}

/**
 * Search Events in Elastic
 */
export async function searchEvents(index: string, query: any) {
  try {
    const client = getElasticClient()
    if (!client) return null

    const response = await client.search({
      index: `${config.elasticIndexPrefix}-${index}`,
      body: query,
    })

    return response
  } catch (error) {
    logger.error('Failed to search events in Elastic:', error)
    return null
  }
}

export { ElasticClient }
