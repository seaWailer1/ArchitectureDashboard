import { Request, Response, NextFunction } from 'express';

// Performance monitoring and optimization for African markets
// Handles request timing, caching, and bandwidth optimization

interface PerformanceMetrics {
  requestId: string;
  method: string;
  url: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  responseSize?: number;
  statusCode?: number;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
}

// Store for performance metrics (in production, use proper analytics service)
const performanceMetrics: PerformanceMetrics[] = [];

// Request timing middleware
export function performanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add request ID to headers for tracking
  res.setHeader('X-Request-ID', requestId);
  
  const metric: PerformanceMetrics = {
    requestId,
    method: req.method,
    url: req.url,
    startTime,
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip,
    country: getCountryFromIP(req.ip || '')
  };
  
  // Override res.end to capture metrics
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const endTime = Date.now();
    metric.endTime = endTime;
    metric.duration = endTime - startTime;
    metric.statusCode = res.statusCode;
    
    if (chunk) {
      metric.responseSize = Buffer.byteLength(chunk, encoding);
    }
    
    // Store metric
    performanceMetrics.push(metric);
    
    // Keep only last 1000 metrics in memory
    if (performanceMetrics.length > 1000) {
      performanceMetrics.splice(0, performanceMetrics.length - 1000);
    }
    
    // Log slow requests for African markets (>2 seconds)
    if (metric.duration && metric.duration > 2000) {
      console.warn(`Slow request detected: ${metric.method} ${metric.url} took ${metric.duration}ms`);
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

// Compression middleware for bandwidth optimization
export function compressionMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip compression for already compressed content
  const contentType = res.getHeader('Content-Type') as string;
  if (contentType && (
    contentType.includes('image/') || 
    contentType.includes('audio/') || 
    contentType.includes('video/')
  )) {
    return next();
  }
  
  // Enable compression for text-based content
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
  } else if (acceptEncoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
  }
  
  next();
}

// Cache optimization for static content
export function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  const url = req.url;
  
  // Cache static assets for 1 year
  if (url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
  }
  // Cache API responses for 5 minutes
  else if (url.startsWith('/api/') && req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  // Cache HTML pages for 1 hour
  else if (url.endsWith('.html') || url === '/' || !url.includes('.')) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  
  next();
}

// Bandwidth optimization for African networks
export function bandwidthOptimization(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.get('User-Agent') || '';
  const country = getCountryFromIP(req.ip || '');
  
  // Detect low-bandwidth scenarios
  const isLowBandwidth = 
    userAgent.includes('Opera Mini') ||
    userAgent.includes('2G') ||
    country && ['NG', 'GH', 'KE', 'UG', 'TZ'].includes(country);
  
  if (isLowBandwidth) {
    // Add headers for low bandwidth optimization
    res.setHeader('X-Low-Bandwidth', 'true');
    res.setHeader('X-Optimize-Images', 'true');
    res.setHeader('X-Reduce-Quality', 'true');
  }
  
  next();
}

// Get performance analytics
export async function getPerformanceAnalytics(req: Request, res: Response) {
  try {
    const { timeframe = '24h', country } = req.query;
    
    let metrics = [...performanceMetrics];
    
    // Filter by timeframe
    const now = Date.now();
    const timeframes = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };
    
    const timeframeMs = timeframes[timeframe as keyof typeof timeframes] || timeframes['24h'];
    metrics = metrics.filter(m => now - m.startTime <= timeframeMs);
    
    // Filter by country if specified
    if (country) {
      metrics = metrics.filter(m => m.country === country);
    }
    
    // Calculate analytics
    const analytics = {
      totalRequests: metrics.length,
      averageResponseTime: metrics.reduce((sum, m) => sum + (m.duration || 0), 0) / metrics.length,
      medianResponseTime: calculateMedian(metrics.map(m => m.duration || 0)),
      p95ResponseTime: calculatePercentile(metrics.map(m => m.duration || 0), 95),
      slowRequests: metrics.filter(m => (m.duration || 0) > 2000).length,
      errorRate: metrics.filter(m => (m.statusCode || 0) >= 400).length / metrics.length * 100,
      requestsByCountry: groupByCountry(metrics),
      requestsByHour: groupByHour(metrics),
      slowestEndpoints: getSlowestEndpoints(metrics),
      bandwidthUsage: calculateBandwidthUsage(metrics),
      mobileUsage: calculateMobileUsage(metrics)
    };
    
    res.json({
      timeframe,
      country,
      analytics,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Performance analytics error:', error);
    res.status(500).json({ error: 'Failed to get performance analytics' });
  }
}

// Optimize API responses for mobile networks
export function mobileOptimization(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|Windows Phone/.test(userAgent);
  
  if (isMobile) {
    // Add mobile-specific headers
    res.setHeader('X-Mobile-Optimized', 'true');
    
    // Override res.json to minimize response size
    const originalJson = res.json;
    res.json = function(obj: any) {
      // Remove unnecessary fields for mobile
      if (typeof obj === 'object' && obj !== null) {
        obj = optimizeForMobile(obj);
      }
      return originalJson.call(this, obj);
    };
  }
  
  next();
}

// Helper functions

function getCountryFromIP(ip: string): string {
  // Simplified country detection - in production use proper GeoIP service
  const countryMap: { [key: string]: string } = {
    '127.0.0.1': 'US',
    'localhost': 'US'
  };
  
  return countryMap[ip] || 'Unknown';
}

function calculateMedian(values: number[]): number {
  const sorted = values.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
}

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

function groupByCountry(metrics: PerformanceMetrics[]) {
  const grouped: { [country: string]: number } = {};
  metrics.forEach(m => {
    const country = m.country || 'Unknown';
    grouped[country] = (grouped[country] || 0) + 1;
  });
  return grouped;
}

function groupByHour(metrics: PerformanceMetrics[]) {
  const grouped: { [hour: string]: number } = {};
  metrics.forEach(m => {
    const hour = new Date(m.startTime).getHours().toString().padStart(2, '0');
    grouped[hour] = (grouped[hour] || 0) + 1;
  });
  return grouped;
}

function getSlowestEndpoints(metrics: PerformanceMetrics[]) {
  const endpointMetrics: { [endpoint: string]: number[] } = {};
  
  metrics.forEach(m => {
    if (m.duration) {
      const endpoint = `${m.method} ${m.url}`;
      if (!endpointMetrics[endpoint]) {
        endpointMetrics[endpoint] = [];
      }
      endpointMetrics[endpoint].push(m.duration);
    }
  });
  
  const averages = Object.entries(endpointMetrics)
    .map(([endpoint, durations]) => ({
      endpoint,
      averageTime: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      requestCount: durations.length
    }))
    .sort((a, b) => b.averageTime - a.averageTime)
    .slice(0, 10);
    
  return averages;
}

function calculateBandwidthUsage(metrics: PerformanceMetrics[]) {
  const totalBytes = metrics.reduce((sum, m) => sum + (m.responseSize || 0), 0);
  const totalMB = totalBytes / (1024 * 1024);
  
  return {
    totalBytes,
    totalMB: Math.round(totalMB * 100) / 100,
    averageResponseSize: totalBytes / metrics.length
  };
}

function calculateMobileUsage(metrics: PerformanceMetrics[]) {
  const mobileMetrics = metrics.filter(m => 
    m.userAgent && /Mobile|Android|iPhone|iPad|Windows Phone/.test(m.userAgent)
  );
  
  return {
    totalMobileRequests: mobileMetrics.length,
    mobilePercentage: (mobileMetrics.length / metrics.length) * 100,
    averageMobileResponseTime: mobileMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / mobileMetrics.length
  };
}

function optimizeForMobile(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => optimizeForMobile(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const optimized: any = {};
    
    // Remove or minimize non-essential fields for mobile
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      // Skip large text fields on mobile
      if (typeof value === 'string' && value.length > 500) {
        optimized[key] = value.substring(0, 100) + '...';
      }
      // Skip metadata fields on mobile
      else if (!['metadata', 'debug', 'trace', 'logs'].includes(key)) {
        optimized[key] = optimizeForMobile(value);
      }
    });
    
    return optimized;
  }
  
  return obj;
}