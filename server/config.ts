/**
 * Configuration loader for the Qala Kurdish Chat Application
 * Loads environment variables from .env file and provides typed access
 */

// Import dotenv if needed - usually not needed in production environments
// that provide environment variables directly
try {
  // Only try to load .env in development
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import to avoid issues in environments that don't support it
    const dotenv = require('dotenv');
    dotenv.config();
  }
} catch (e) {
  console.log('No .env file found or dotenv not installed. Using environment variables.');
}

// API Keys
export const COHERE_API_KEY = process.env.COHERE_API_KEY || '';

// Server Configuration
export const PORT = parseInt(process.env.PORT || '5000', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Optimization Settings
export const CACHE_SIZE = parseInt(process.env.CACHE_SIZE || '1000', 10);
export const CACHE_TTL_MINUTES = parseInt(process.env.CACHE_TTL_MINUTES || '120', 10);
export const MAX_CONNECTIONS = parseInt(process.env.MAX_CONNECTIONS || '20', 10);
export const ENABLE_THROTTLING = process.env.ENABLE_THROTTLING !== 'false';
export const THROTTLE_CHAT_TOKENS = parseInt(process.env.THROTTLE_CHAT_TOKENS || '20', 10);
export const THROTTLE_CHAT_REFILL = parseInt(process.env.THROTTLE_CHAT_REFILL || '10', 10);
export const PATTERN_INDEX_SIZE = parseInt(process.env.PATTERN_INDEX_SIZE || '100', 10);

// Other Settings
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const STREAMING_CHUNK_SIZE = parseInt(process.env.STREAMING_CHUNK_SIZE || '100', 10);

// Web Hosting Variables
export const HOST = process.env.HOST || '0.0.0.0';
export const BASE_URL = process.env.BASE_URL || '';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Print configuration for debugging
if (NODE_ENV !== 'production') {
  console.log('Application Configuration:');
  console.log({
    NODE_ENV,
    PORT,
    HOST,
    CACHE_SIZE,
    ENABLE_THROTTLING,
    COHERE_API_KEY: COHERE_API_KEY ? '******' : 'Not set',
  });
}

// Export a config object for easier imports
export default {
  COHERE_API_KEY,
  PORT,
  NODE_ENV,
  IS_PRODUCTION,
  CACHE_SIZE,
  CACHE_TTL_MINUTES,
  MAX_CONNECTIONS,
  ENABLE_THROTTLING,
  THROTTLE_CHAT_TOKENS,
  THROTTLE_CHAT_REFILL,
  PATTERN_INDEX_SIZE,
  LOG_LEVEL,
  STREAMING_CHUNK_SIZE,
  HOST,
  BASE_URL,
  CORS_ORIGIN
};