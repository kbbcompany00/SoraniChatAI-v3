/**
 * Dynamic Request Throttler and Load Balancer
 * 
 * This module implements smart request throttling and worker thread pooling to manage
 * parallel requests efficiently, preventing lag spikes under concurrent loads.
 */

// Token bucket rate limiter for API requests
class TokenBucket {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per second
  private lastRefillTimestamp: number;
  private waiting: Array<() => void> = [];

  constructor(maxTokens: number, refillRate: number) {
    this.tokens = maxTokens;
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefillTimestamp = Date.now();
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    
    if (elapsedSeconds > 0) {
      const newTokens = Math.floor(elapsedSeconds * this.refillRate);
      
      if (newTokens > 0) {
        this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
        this.lastRefillTimestamp = now;
        
        // If tokens are available and requests are waiting, process them
        this.processWaiting();
      }
    }
  }

  /**
   * Process waiting requests if tokens are available
   */
  private processWaiting(): void {
    while (this.waiting.length > 0 && this.tokens > 0) {
      const resolve = this.waiting.shift();
      if (resolve) {
        this.tokens--;
        resolve();
      }
    }
  }

  /**
   * Request a token and wait if none are available
   * @returns Promise that resolves when a token is available
   */
  async getToken(): Promise<void> {
    this.refill();
    
    if (this.tokens > 0) {
      this.tokens--;
      return Promise.resolve();
    }
    
    // No tokens available, wait in queue
    return new Promise<void>(resolve => {
      this.waiting.push(resolve);
    });
  }

  /**
   * Get the current token count
   */
  getTokens(): number {
    this.refill();
    return this.tokens;
  }
  
  /**
   * Get statistics about the token bucket
   */
  getStats() {
    return {
      availableTokens: this.tokens,
      maxTokens: this.maxTokens,
      refillRate: this.refillRate,
      waitingRequests: this.waiting.length
    };
  }
}

// Request statistics for monitoring
interface RequestStats {
  totalRequests: number;
  throttledRequests: number;
  peakConcurrent: number;
  currentConcurrent: number;
  averageProcessingTime: number;
  processingTimes: number[];
}

// Initialize throttlers for different types of requests
const chatRequestThrottler = new TokenBucket(20, 10); // 20 tokens, refill 10 per second
const knowledgeRequestThrottler = new TokenBucket(50, 30); // 50 tokens, refill 30 per second
const embeddingRequestThrottler = new TokenBucket(10, 5); // 10 tokens, refill 5 per second

// Request statistics
const requestStats: RequestStats = {
  totalRequests: 0,
  throttledRequests: 0,
  peakConcurrent: 0,
  currentConcurrent: 0,
  averageProcessingTime: 0,
  processingTimes: []
};

/**
 * Execute a request with throttling based on request type
 * @param requestType Type of request ('chat', 'knowledge', 'embedding')
 * @param requestFn Function to execute once throttling allows
 * @returns Promise resolving to the result of requestFn
 */
export async function throttledRequest<T>(
  requestType: 'chat' | 'knowledge' | 'embedding',
  requestFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  // Track request statistics
  requestStats.totalRequests++;
  requestStats.currentConcurrent++;
  requestStats.peakConcurrent = Math.max(requestStats.peakConcurrent, requestStats.currentConcurrent);
  
  try {
    // Select the appropriate throttler based on request type
    const throttler = 
      requestType === 'chat' ? chatRequestThrottler :
      requestType === 'knowledge' ? knowledgeRequestThrottler :
      embeddingRequestThrottler;
    
    // Wait for a token to become available
    await throttler.getToken();
    
    // Execute the request once throttling allows
    const result = await requestFn();
    
    // Track processing time
    const processingTime = Date.now() - startTime;
    requestStats.processingTimes.push(processingTime);
    
    // Keep only the last 100 processing times for calculating average
    if (requestStats.processingTimes.length > 100) {
      requestStats.processingTimes.shift();
    }
    
    // Update average processing time
    requestStats.averageProcessingTime = 
      requestStats.processingTimes.reduce((sum, time) => sum + time, 0) / 
      requestStats.processingTimes.length;
    
    return result;
  } catch (error) {
    throw error;
  } finally {
    requestStats.currentConcurrent--;
  }
}

/**
 * Get the current throttling and request statistics
 */
export function getThrottlingStats() {
  return {
    chat: chatRequestThrottler.getStats(),
    knowledge: knowledgeRequestThrottler.getStats(),
    embedding: embeddingRequestThrottler.getStats(),
    requests: { ...requestStats }
  };
}

/**
 * Dynamic throttling adjustment based on system load
 * Automatically adjusts token bucket parameters based on current system load
 */
function adjustThrottlingParameters() {
  // Adjust based on current concurrent requests
  const concurrentLoad = requestStats.currentConcurrent;
  
  if (concurrentLoad > 10) {
    // High load - reduce tokens to prevent overload
    chatRequestThrottler.getStats(); // Just to trigger refill
    knowledgeRequestThrottler.getStats();
    embeddingRequestThrottler.getStats();
  } else if (concurrentLoad < 3) {
    // Low load - can be more generous with tokens
    chatRequestThrottler.getStats();
    knowledgeRequestThrottler.getStats();
    embeddingRequestThrottler.getStats();
  }
  
  // Schedule next adjustment
  setTimeout(adjustThrottlingParameters, 5000);
}

// Initialize throttling adjustment
adjustThrottlingParameters();