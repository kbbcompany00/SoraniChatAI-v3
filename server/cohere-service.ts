/**
 * Optimized Cohere API Service
 * 
 * This module provides a high-performance wrapper around Cohere API calls with
 * connection pooling, retry logic, and response optimization.
 */

import { PerformanceTimer } from './performance';
import { throttledRequest } from './request-throttler';

// Cache for API keys to avoid environment lookups on every request
let apiKeyCache: string | null = null;

/**
 * Get the Cohere API key with caching
 */
function getCohereApiKey(): string {
  if (apiKeyCache) return apiKeyCache;
  
  const apiKey = process.env.COHERE_API_KEY || process.env.COHERE_KEY || '';
  
  if (!apiKey) {
    console.error("Missing Cohere API key. Set COHERE_API_KEY environment variable.");
  }
  
  apiKeyCache = apiKey;
  return apiKey;
}

/**
 * Prepare common headers for Cohere API requests
 */
function getHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${getCohereApiKey()}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'OptimizedCohereClient/1.0'
  };
}

/**
 * Connection pool for Cohere API to reuse connections
 */
class ConnectionPool {
  private maxConnections: number;
  private activeConnections: number = 0;
  private waitingQueue: Array<() => void> = [];
  
  constructor(maxConnections = 10) {
    this.maxConnections = maxConnections;
  }
  
  /**
   * Acquire a connection from the pool
   */
  async acquire(): Promise<void> {
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      return Promise.resolve();
    }
    
    // Wait for a connection to become available
    return new Promise<void>(resolve => {
      this.waitingQueue.push(resolve);
    });
  }
  
  /**
   * Release a connection back to the pool
   */
  release(): void {
    if (this.waitingQueue.length > 0) {
      // Give the connection to the next waiting request
      const resolve = this.waitingQueue.shift();
      if (resolve) resolve();
    } else {
      // No waiting requests, decrement active connections
      this.activeConnections--;
    }
  }
  
  /**
   * Get connection pool statistics
   */
  getStats() {
    return {
      activeConnections: this.activeConnections,
      maxConnections: this.maxConnections,
      waitingRequests: this.waitingQueue.length
    };
  }
}

// Initialize connection pool
const connectionPool = new ConnectionPool(20);

/**
 * Enhanced Cohere chat completion with streaming support
 * @param message User message
 * @param systemPrompt System prompt
 * @param options Additional options
 * @returns ReadableStream for streaming responses
 */
export async function streamingChatCompletion(
  message: string,
  systemPrompt: string,
  options: {
    temperature?: number;
    p?: number;
    maxTokens?: number;
    retryAttempts?: number;
  } = {}
): Promise<ReadableStream<Uint8Array> | null> {
  const timer = new PerformanceTimer();
  
  // Default options
  const {
    temperature = 0.65,
    p = 0.8,
    maxTokens = 800,
    retryAttempts = 2
  } = options;
  
  // Prepare request body
  const cohereRequestBody = {
    message: message,
    model: 'command-r-plus',
    stream: true,
    preamble: systemPrompt,
    temperature: temperature,
    p: p,
    max_tokens: maxTokens
  };
  
  // Throttle and execute the request
  return throttledRequest('chat', async () => {
    let attempts = 0;
    let lastError: Error | null = null;
    
    // Try the request with retries
    while (attempts <= retryAttempts) {
      try {
        // Acquire a connection from the pool
        await connectionPool.acquire();
        timer.mark('connectionAcquired');
        
        // Make the streaming request to Cohere
        const cohereResponse = await fetch('https://api.cohere.ai/v1/chat', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(cohereRequestBody)
        });
        
        timer.mark('apiResponseReceived');
        
        if (!cohereResponse.ok) {
          // Handle error response
          const errorText = await cohereResponse.text();
          console.error(`Cohere API error: ${cohereResponse.status} ${errorText}`);
          lastError = new Error(`Cohere API error: ${cohereResponse.status} ${errorText}`);
          throw lastError;
        }
        
        // Extract the streaming body
        const responseBody = cohereResponse.body;
        if (!responseBody) {
          throw new Error('No response body from Cohere API');
        }
        
        console.log(`Cohere API request completed in ${timer.elapsed()}ms`);
        return responseBody;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        attempts++;
        
        if (attempts <= retryAttempts) {
          console.log(`Retry attempt ${attempts} for Cohere API request`);
          // Exponential backoff before retry
          await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempts)));
        }
      } finally {
        // Always release the connection back to the pool
        connectionPool.release();
      }
    }
    
    // If all retries failed, throw the last error
    if (lastError) {
      throw lastError;
    }
    
    return null;
  });
}

/**
 * Process streaming response chunks from Cohere API with optimizations
 * @param reader ReadableStreamDefaultReader from streaming response
 * @param onChunk Callback for each processed text chunk
 * @param onComplete Callback when streaming is complete
 */
export async function processStreamingResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void
): Promise<void> {
  let completeResponse = '';
  const timer = new PerformanceTimer();
  
  try {
    // Process chunks from the stream with optimized parsing
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // Decode the chunk efficiently
      const chunk = Buffer.from(value).toString('utf-8');
      
      // Process each line in the chunk (Cohere sends JSON lines)
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.includes('"text"')) {
          try {
            // Handle potential JSON parsing issues with optimized approach
            let jsonString = line;
            
            // If JSON is malformed (doesn't end with closing brace), try to fix it
            if (!jsonString.endsWith('}')) {
              jsonString += '}';
            }
            
            const jsonLine = JSON.parse(jsonString);
            if (jsonLine.text) {
              // Clean and concatenate full response without Unicode character issues
              const cleanText = jsonLine.text
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                // Remove any special character separators that make text unusable
                .replace(/([^\s])\\([a-zA-Z])/g, '$1$2')
                // Handle Kurdish characters by removing quotes
                .replace(/"([ەڕێۆ،ن])"/g, '$1');
              
              completeResponse += cleanText;
              onChunk(cleanText);
            }
          } catch (e) {
            // If JSON parsing fails, try to extract text with regex
            try {
              const textMatch = line.match(/"text":"([^"]*)"/);
              if (textMatch && textMatch[1]) {
                const text = textMatch[1]
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"');
                completeResponse += text;
                onChunk(text);
              } else {
                console.error('Error parsing JSON line:', e);
              }
            } catch (regexError) {
              console.error('Error with regex extraction:', regexError);
            }
          }
        }
      }
    }
    
    // Call the completion callback with the full response
    onComplete(completeResponse);
    
    timer.mark('processingComplete');
    console.log(`Stream processing completed in ${timer.elapsed()}ms, response length: ${completeResponse.length}`);
  } catch (error) {
    console.error('Error processing streaming response:', error);
    throw error;
  }
}

/**
 * Get service statistics
 */
export function getServiceStats() {
  return {
    connections: connectionPool.getStats(),
    apiKeyConfigured: !!getCohereApiKey()
  };
}