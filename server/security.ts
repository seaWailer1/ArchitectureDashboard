import crypto from 'crypto';

// Security utilities
export class SecurityUtils {
  // Generate secure random tokens
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash sensitive data
  static hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Encrypt sensitive data
  static encrypt(text: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decrypt sensitive data
  static decrypt(encryptedText: string, key: string): string {
    const algorithm = 'aes-256-cbc';
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Validate transaction amounts
  static validateAmount(amount: string): boolean {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000000;
  }

  // Rate limiting check
  static checkRateLimit(ip: string, action: string): boolean {
    // Implementation would use Redis or in-memory store
    // For now, return true (allow)
    return true;
  }

  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .replace(/['"]/g, '') // Remove quote characters
      .trim()
      .slice(0, 255); // Limit length
  }

  // Validate session integrity
  static validateSession(sessionData: any): boolean {
    if (!sessionData || !sessionData.userId) return false;
    
    // Check session expiry
    const now = Date.now();
    const sessionAge = now - (sessionData.createdAt || 0);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return sessionAge < maxAge;
  }
}

// Audit logging
export class AuditLogger {
  static log(action: string, userId: string, details: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };
    
    console.log('[AUDIT]', JSON.stringify(logEntry));
    
    // In production, send to monitoring service
    // e.g., Sentry, DataDog, CloudWatch
  }

  static logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'SECURITY_EVENT',
      event,
      severity,
      details
    };
    
    console.error('[SECURITY]', JSON.stringify(logEntry));
    
    // In production, trigger alerts for high/critical events
    if (severity === 'high' || severity === 'critical') {
      // Send to security monitoring system
    }
  }
}