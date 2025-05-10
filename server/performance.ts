/**
 * Performance optimization module for ultra-fast AI responses
 * This module provides utilities for caching, memoization, and performance optimizations
 * while preserving the integrity of the existing codebase
 */

// Type declaration for KnowledgeEntry to avoid circular dependencies
export interface KnowledgeEntry {
  patterns: string[];
  response: string;
  links?: string[];
  priority?: number;
}

// ======= Response Caching System =======
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
}

class ResponseCache<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(maxSize = 1000, ttlMinutes = 60) {
    this.maxSize = maxSize;
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.stats.evictions++;
      return undefined;
    }

    entry.accessCount++;
    this.stats.hits++;
    return entry.value;
  }

  set(key: K, value: V): void {
    // Evict least recently used entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 1
    });
  }

  private evictLRU(): void {
    let lruKey: K | null = null;
    let lruCount = Infinity;
    let lruTimestamp = Infinity;

    // Use forEach instead of for...of to avoid MapIterator issues
    this.cache.forEach((entry, key) => {
      // Prioritize less accessed entries, then older ones
      if (entry.accessCount < lruCount || 
         (entry.accessCount === lruCount && entry.timestamp < lruTimestamp)) {
        lruKey = key;
        lruCount = entry.accessCount;
        lruTimestamp = entry.timestamp;
      }
    });

    if (lruKey !== null) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  getStats() {
    return { ...this.stats, size: this.cache.size };
  }

  clear(): void {
    this.cache.clear();
  }
}

// ======= Pattern Matching Optimization =======

/**
 * Response result cache for optimized knowledge base access
 * Caches the normalized user queries and their matching knowledge entries
 */
export const patternMatchCache = new ResponseCache<string, KnowledgeEntry | null>(
  500, // Cache up to 500 different queries
  120  // Cache for 2 hours before expiration
);

/**
 * Precomputed pattern map for O(1) lookups instead of O(n) iterations
 * Maps normalized patterns to indices in the knowledge base
 */
export const patternMap = new Map<string, number[]>();

/**
 * Regular expression cache for fast matching
 * Avoids recompiling regexes for each query
 */
export const regexCache = new Map<string, RegExp>();

/**
 * Parse and index patterns for ultra-fast lookups
 * @param allPatterns Array of pattern arrays from the knowledge base
 */
export function indexPatterns(entries: KnowledgeEntry[]): void {
  // Clear existing indices
  patternMap.clear();
  
  // Index each pattern for direct lookups
  entries.forEach((entry, entryIndex) => {
    entry.patterns.forEach(pattern => {
      const normalizedPattern = pattern.toLowerCase().trim();
      
      // Add entry index to the pattern map
      if (!patternMap.has(normalizedPattern)) {
        patternMap.set(normalizedPattern, [entryIndex]);
      } else {
        patternMap.get(normalizedPattern)?.push(entryIndex);
      }
      
      // Precompile regex patterns for common variations
      if (!regexCache.has(normalizedPattern)) {
        try {
          // Create a flexible regex that matches the pattern with word boundaries
          const regexPattern = new RegExp(`\\b${escapeRegExp(normalizedPattern)}\\b`, 'i');
          regexCache.set(normalizedPattern, regexPattern);
        } catch (e) {
          // If regex creation fails, skip this pattern
          console.error(`Failed to create regex for pattern: ${normalizedPattern}`);
        }
      }
    });
  });
}

/**
 * Escape special characters in string for use in regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Tokenize text into individual words for faster matching
 * @param text Text to tokenize
 * @returns Array of tokens (words)
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(token => token.length > 0);
}

/**
 * Calculate response streaming chunks for optimized delivery
 * Prepares chunks for streaming without affecting existing code's output
 * @param response The complete response text
 * @param chunkSize Optional custom chunk size (characters)
 * @returns Array of optimized chunks
 */
export function prepareStreamingChunks(response: string, chunkSize = 100): string[] {
  const lines = response.split('\n');
  const chunks: string[] = [];
  
  // Special case for emoji/character lists - keep them together
  let currentChunk = '';
  
  for (const line of lines) {
    // If line is short enough, add it as its own chunk
    if (line.length <= chunkSize) {
      if (line.trim()) {
        chunks.push(line);
      }
      continue;
    }
    
    // For longer lines, split by sentences or chunks
    let remainingText = line;
    while (remainingText.length > 0) {
      // Try to split at sentence boundary if possible
      let sentenceEnd = remainingText.indexOf('. ');
      if (sentenceEnd > 0 && sentenceEnd < chunkSize) {
        chunks.push(remainingText.substring(0, sentenceEnd + 1));
        remainingText = remainingText.substring(sentenceEnd + 2);
        continue;
      }
      
      // Otherwise split by chunk size, but try to keep words intact
      let splitPos = Math.min(chunkSize, remainingText.length);
      if (splitPos < remainingText.length) {
        // Find the last space before the chunk size
        const lastSpace = remainingText.lastIndexOf(' ', splitPos);
        if (lastSpace > 0) {
          splitPos = lastSpace;
        }
      }
      
      chunks.push(remainingText.substring(0, splitPos));
      remainingText = remainingText.substring(splitPos).trim();
    }
  }
  
  return chunks.filter(chunk => chunk.trim().length > 0);
}

// ======= Async Worker Pool =======

/**
 * Worker thread pool for parallel processing
 * Uses web workers in the browser, or worker_threads in Node.js
 */
class WorkerPool {
  private activeWorkers = 0;
  private maxWorkers: number;
  private queue: (() => Promise<void>)[] = [];
  
  constructor(maxWorkers = 4) {
    this.maxWorkers = maxWorkers;
  }
  
  /**
   * Enqueue a task for execution
   * @param task Function to execute
   * @returns Promise that resolves when the task completes
   */
  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const wrappedTask = async (): Promise<void> => {
        try {
          this.activeWorkers++;
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
          throw error;
        } finally {
          this.activeWorkers--;
          this.processQueue();
        }
      };
      
      if (this.activeWorkers < this.maxWorkers) {
        // Execute immediately if we have capacity
        wrappedTask();
      } else {
        // Queue for later execution
        this.queue.push(wrappedTask);
      }
    });
  }
  
  private processQueue() {
    if (this.queue.length > 0 && this.activeWorkers < this.maxWorkers) {
      const nextTask = this.queue.shift();
      if (nextTask) {
        nextTask();
      }
    }
  }
  
  get stats() {
    return {
      activeWorkers: this.activeWorkers,
      queuedTasks: this.queue.length
    };
  }
}

// Export worker pool instance for parallel processing
export const workerPool = new WorkerPool();

// ======= Performance Monitoring =======

/**
 * Performance timer utility for measuring execution time
 */
export class PerformanceTimer {
  private startTime: number;
  private timings: Record<string, number> = {};
  
  constructor() {
    this.startTime = Date.now();
  }
  
  /**
   * Mark a point in time with a label
   * @param label Label for this timing point
   */
  mark(label: string): void {
    this.timings[label] = Date.now() - this.startTime;
  }
  
  /**
   * Get elapsed time since timer creation or a marked point
   * @param fromMark Optional mark label to measure from
   * @returns Elapsed time in milliseconds
   */
  elapsed(fromMark?: string): number {
    const startPoint = fromMark ? this.timings[fromMark] || 0 : 0;
    return Date.now() - this.startTime - startPoint;
  }
  
  /**
   * Get all timing measurements
   * @returns Record of timing measurements
   */
  getTimings(): Record<string, number> {
    return { ...this.timings, total: Date.now() - this.startTime };
  }
  
  /**
   * Reset the timer
   */
  reset(): void {
    this.startTime = Date.now();
    this.timings = {};
  }
}

// ======= Response Prefetching =======

/**
 * Prefetch cache that preloads responses for common queries
 */
class PrefetchCache<T> {
  private cache = new Map<string, T>();
  
  /**
   * Add items to prefetch cache
   * @param items Map of items to prefetch
   */
  preload(items: Map<string, T> | Record<string, T>): void {
    if (items instanceof Map) {
      items.forEach((value, key) => {
        this.cache.set(key, value);
      });
    } else {
      Object.entries(items).forEach(([key, value]) => {
        this.cache.set(key, value);
      });
    }
  }
  
  /**
   * Get a prefetched item
   * @param key Cache key
   * @returns Cached item or undefined
   */
  get(key: string): T | undefined {
    return this.cache.get(key);
  }
  
  /**
   * Set an item in the cache
   * @param key Cache key
   * @param value Item to cache
   */
  set(key: string, value: T): void {
    this.cache.set(key, value);
  }
  
  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Check if key exists in cache
   * @param key Cache key
   * @returns True if key exists
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
  
  /**
   * Get the number of items in the cache
   */
  get size(): number {
    return this.cache.size;
  }
}

// Export prefetch cache for common responses
export const prefetchCache = new PrefetchCache<KnowledgeEntry>();