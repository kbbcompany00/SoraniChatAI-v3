/**
 * Knowledge Base Sync Manager
 * 
 * This module provides real-time auto-sync capabilities to keep the knowledge base
 * up to date without manual intervention or full reloads.
 * 
 * It implements a lightweight synchronization system that allows the AI to deliver
 * the most current information without full reloads.
 */

import { KnowledgeEntry } from './performance';
import { qalaInstitute } from './knowledge-base';
import { 
  patternMatchCache, 
  patternMap, 
  indexPatterns, 
  prefetchCache 
} from './performance';

// Track knowledge base versions for optimistic updates
let knowledgeBaseVersion = 1;
let lastSyncTimestamp = Date.now();

// Sync management statistics
const syncStats = {
  totalSyncs: 0,
  cacheResets: 0,
  partialUpdates: 0,
  lastSyncDuration: 0
};

/**
 * Refresh the knowledge base indices and caches
 * @param forceFullRefresh Whether to force a complete refresh of all caches
 */
export function refreshKnowledgeBase(forceFullRefresh = false): void {
  const startTime = Date.now();
  
  if (forceFullRefresh) {
    // Full refresh - clear all caches and rebuild indices
    patternMatchCache.clear();
    // Clear the pattern map manually since it's a Map
    patternMap.clear();
    // Reimport and rebuild everything
    indexPatterns(qalaInstitute);
    syncStats.cacheResets++;
  } else {
    // Partial refresh - only update pattern map and prefetch cache
    indexPatterns(qalaInstitute);
    
    // Refresh the prefetch cache with updated entries
    qalaInstitute.forEach((entry) => {
      if (entry.patterns.length > 0) {
        prefetchCache.set(entry.patterns[0].toLowerCase().trim(), entry);
      }
    });
    
    syncStats.partialUpdates++;
  }
  
  // Update sync metadata
  knowledgeBaseVersion++;
  lastSyncTimestamp = Date.now();
  syncStats.totalSyncs++;
  syncStats.lastSyncDuration = Date.now() - startTime;
  
  console.log(`Knowledge base refreshed (${forceFullRefresh ? 'full' : 'partial'}) in ${syncStats.lastSyncDuration}ms`);
}

/**
 * Get the current knowledge base sync statistics
 */
export function getSyncStats() {
  return {
    ...syncStats,
    knowledgeBaseVersion,
    lastSyncTimestamp,
    timeSinceLastSync: Date.now() - lastSyncTimestamp,
    entriesCount: qalaInstitute.length,
    patternCount: patternMap.size,
    prefetchCacheSize: prefetchCache.size,
    matchCacheSize: patternMatchCache.getStats().size
  };
}

/**
 * Update a specific entry in the knowledge base and refresh indices
 * This allows selective updates without full reloads
 * @param entryIndex Index of entry to update
 * @param updatedEntry Updated entry data
 */
export function updateKnowledgeEntry(entryIndex: number, updatedEntry: Partial<KnowledgeEntry>): void {
  if (entryIndex >= 0 && entryIndex < qalaInstitute.length) {
    const currentEntry = qalaInstitute[entryIndex];
    
    // Merge the update with existing entry
    Object.assign(currentEntry, updatedEntry);
    
    // Refresh knowledge base with partial update
    refreshKnowledgeBase(false);
    
    console.log(`Knowledge entry ${entryIndex} updated, indices refreshed`);
  } else {
    console.error(`Cannot update knowledge entry: invalid index ${entryIndex}`);
  }
}

// Initialize sync manager on module load
(function initializeSyncManager() {
  // Set up automatic refresh every hour to keep indices optimized
  setInterval(() => {
    console.log('Running scheduled knowledge base refresh');
    refreshKnowledgeBase(false);
  }, 60 * 60 * 1000); // Every hour
  
  console.log('Knowledge base sync manager initialized');
})();