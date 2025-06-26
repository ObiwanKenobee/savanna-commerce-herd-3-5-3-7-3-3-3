import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/**
 * Simple cache middleware for Express
 * This is a simple in-memory cache implementation for demonstration
 * In production, use Redis or another dedicated caching solution
 */

// Simple in-memory cache
const cache: Map<string, {
  data: any;
  expiry: number;
}> = new Map();

/**
 * Cache middleware
 * @param ttl - Time to live in seconds
 */
export const cacheMiddleware = (ttl: number = 60) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL
    const cacheKey = `${req.originalUrl || req.url}`;
    
    // Check if we have a cached response
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse && cachedResponse.expiry > Date.now()) {
      // Return cached response
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.json(cachedResponse.data);
    }

    // Cache miss - capture the response
    const originalSend = res.json;
    
    res.json = function(body) {
      // Store in cache if status is success
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(cacheKey, {
          data: body,
          expiry: Date.now() + (ttl * 1000)
        });
        logger.debug(`Cached response for ${cacheKey}`);
      }
      
      return originalSend.call(this, body);
    };
    
    next();
  };
};

// Function to clear the cache
export const clearCache = (pattern?: string) => {
  if (pattern) {
    // Clear cache entries that match the pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
    logger.debug(`Cleared cache for pattern: ${pattern}`);
  } else {
    // Clear all cache
    cache.clear();
    logger.debug('Cleared all cache');
  }
};
