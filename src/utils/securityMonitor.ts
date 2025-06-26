/**
 * Security Monitoring Utility for Savanna Marketplace
 * Provides comprehensive security event logging and monitoring
 */

export interface SecurityEvent {
  type: "auth" | "payment" | "access" | "data" | "navigation";
  level: "info" | "warning" | "error" | "critical";
  message: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;
  private readonly criticalThreshold = 5;
  private criticalEventCount = 0;

  constructor() {
    // Initialize security monitoring
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor for suspicious activity patterns
    window.addEventListener("error", (event) => {
      this.logSecurityEvent({
        type: "navigation",
        level: "error",
        message: `JavaScript error: ${event.message}`,
        timestamp: new Date().toISOString(),
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Monitor for console manipulation attempts
    const originalConsole = { ...console };

    // Detect if someone tries to override console methods (potential XSS)
    Object.keys(console).forEach((method) => {
      const original = (console as any)[method];
      (console as any)[method] = (...args: any[]) => {
        // Check for suspicious console usage
        if (
          args.some(
            (arg) =>
              typeof arg === "string" &&
              (arg.includes("<script>") ||
                arg.includes("javascript:") ||
                arg.includes("eval(")),
          )
        ) {
          this.logSecurityEvent({
            type: "data",
            level: "critical",
            message: "Potential XSS attempt detected in console",
            timestamp: new Date().toISOString(),
            metadata: {
              method,
              args: args.map((a) => String(a).slice(0, 100)),
            },
          });
        }

        return original.apply(console, args);
      };
    });
  }

  public logSecurityEvent(event: SecurityEvent): void {
    // Add system information
    const enhancedEvent: SecurityEvent = {
      ...event,
      userAgent: navigator.userAgent,
      timestamp: event.timestamp || new Date().toISOString(),
      sessionId: this.getSessionId(),
    };

    this.events.push(enhancedEvent);

    // Maintain event limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Handle critical events
    if (event.level === "critical") {
      this.criticalEventCount++;
      this.handleCriticalEvent(enhancedEvent);
    }

    // Log to console with appropriate level
    this.logToConsole(enhancedEvent);

    // Send to backend (in production)
    this.sendToBackend(enhancedEvent);
  }

  private getSessionId(): string {
    return sessionStorage.getItem("savanna_session_id") || "anonymous";
  }

  private handleCriticalEvent(event: SecurityEvent): void {
    console.error("🚨 CRITICAL SECURITY EVENT:", event);

    // If too many critical events, lock down
    if (this.criticalEventCount >= this.criticalThreshold) {
      this.lockdownMode();
    }
  }

  private lockdownMode(): void {
    console.error("🔒 SECURITY LOCKDOWN INITIATED");

    // Clear sensitive data
    localStorage.removeItem("savanna_user");
    sessionStorage.clear();

    // Redirect to safe page
    setTimeout(() => {
      window.location.href = "/auth?security_lockdown=true";
    }, 1000);
  }

  private logToConsole(event: SecurityEvent): void {
    const emoji = this.getEventEmoji(event.type, event.level);
    const prefix = `${emoji} Security ${event.level.toUpperCase()}:`;

    switch (event.level) {
      case "critical":
      case "error":
        console.error(prefix, event.message, event.metadata);
        break;
      case "warning":
        console.warn(prefix, event.message, event.metadata);
        break;
      default:
        console.log(prefix, event.message, event.metadata);
    }
  }

  private getEventEmoji(
    type: SecurityEvent["type"],
    level: SecurityEvent["level"],
  ): string {
    const typeEmojis = {
      auth: "🔐",
      payment: "💳",
      access: "🛡️",
      data: "📊",
      navigation: "🧭",
    };

    const levelEmojis = {
      critical: "🚨",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    return `${levelEmojis[level]} ${typeEmojis[type]}`;
  }

  private async sendToBackend(event: SecurityEvent): Promise<void> {
    // In production, send to security monitoring service
    try {
      // Only send critical and error events to avoid spam
      if (event.level === "critical" || event.level === "error") {
        // await fetch('/api/security/events', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(event)
        // });
        console.log("📡 Would send to security backend:", event);
      }
    } catch (error) {
      console.error("Failed to send security event to backend:", error);
    }
  }

  public getRecentEvents(count = 10): SecurityEvent[] {
    return this.events.slice(-count);
  }

  public getCriticalEvents(): SecurityEvent[] {
    return this.events.filter((event) => event.level === "critical");
  }

  public clearEvents(): void {
    this.events = [];
    this.criticalEventCount = 0;
  }

  // Authentication security helpers
  public logAuthAttempt(email: string, success: boolean, metadata?: any): void {
    this.logSecurityEvent({
      type: "auth",
      level: success ? "info" : "warning",
      message: `Authentication ${success ? "successful" : "failed"} for ${email.split("@")[1]}`,
      timestamp: new Date().toISOString(),
      metadata: {
        emailDomain: email.split("@")[1],
        success,
        ...metadata,
      },
    });
  }

  // Payment security helpers
  public logPaymentAttempt(
    amount: number,
    method: string,
    success: boolean,
    metadata?: any,
  ): void {
    this.logSecurityEvent({
      type: "payment",
      level: success ? "info" : "warning",
      message: `Payment ${success ? "successful" : "failed"}: ${method} for ${amount}`,
      timestamp: new Date().toISOString(),
      metadata: {
        amount,
        method,
        success,
        ...metadata,
      },
    });
  }

  // Access control helpers
  public logAccessAttempt(
    resource: string,
    allowed: boolean,
    userRole?: string,
  ): void {
    this.logSecurityEvent({
      type: "access",
      level: allowed ? "info" : "warning",
      message: `Access ${allowed ? "granted" : "denied"} to ${resource}`,
      timestamp: new Date().toISOString(),
      metadata: {
        resource,
        allowed,
        userRole,
      },
    });
  }

  // Data security helpers
  public logDataAccess(
    dataType: string,
    operation: string,
    userId?: string,
  ): void {
    this.logSecurityEvent({
      type: "data",
      level: "info",
      message: `Data ${operation}: ${dataType}`,
      timestamp: new Date().toISOString(),
      userId,
      metadata: {
        dataType,
        operation,
      },
    });
  }

  // Navigation security helpers
  public logSuspiciousNavigation(path: string, reason: string): void {
    this.logSecurityEvent({
      type: "navigation",
      level: "warning",
      message: `Suspicious navigation to ${path}: ${reason}`,
      timestamp: new Date().toISOString(),
      metadata: {
        path,
        reason,
        referrer: document.referrer,
      },
    });
  }
}

// Global security monitor instance
export const securityMonitor = new SecurityMonitor();

// Convenience functions for common security events
export const logAuthEvent = (email: string, success: boolean, metadata?: any) =>
  securityMonitor.logAuthAttempt(email, success, metadata);

export const logPaymentEvent = (
  amount: number,
  method: string,
  success: boolean,
  metadata?: any,
) => securityMonitor.logPaymentAttempt(amount, method, success, metadata);

export const logAccessEvent = (
  resource: string,
  allowed: boolean,
  userRole?: string,
) => securityMonitor.logAccessAttempt(resource, allowed, userRole);

export const logDataEvent = (
  dataType: string,
  operation: string,
  userId?: string,
) => securityMonitor.logDataAccess(dataType, operation, userId);

export const logNavigationEvent = (path: string, reason: string) =>
  securityMonitor.logSuspiciousNavigation(path, reason);

export default securityMonitor;
