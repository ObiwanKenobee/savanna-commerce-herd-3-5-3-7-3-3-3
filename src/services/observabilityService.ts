/**
 * Observability Service - "The Pressure Gauges"
 * Telemetry network with Kenyan metrics and Swahili logging
 * Monitors M-Pesa timeout rates, USSD session duration, Core Web Vitals
 */

export interface KenyanMetric {
  name: string;
  value: number;
  unit: string;
  county?: string;
  timestamp: number;
  labels: Record<string, string>;
}

export interface SwahiliLogEntry {
  timestamp: number;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  english: string;
  sheng?: string;
  context: {
    userId?: string;
    county?: string;
    service?: string;
    traceId?: string;
  };
  metadata?: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: "greater_than" | "less_than" | "equals";
  threshold: number;
  county?: string;
  severity: "low" | "medium" | "high" | "critical";
  isActive: boolean;
  lastTriggered?: number;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  county: string;
  connectionType: string;
  timestamp: number;
}

class ObservabilityService {
  private metrics: Map<string, KenyanMetric[]> = new Map();
  private logs: SwahiliLogEntry[] = [];
  private alerts: Map<string, AlertRule> = new Map();
  private webVitals: CoreWebVitals[] = [];
  private activeTraces: Map<string, any> = new Map();

  constructor() {
    this.initializeDefaultAlerts();
    this.startMetricsCollection();
  }

  private initializeDefaultAlerts(): void {
    const defaultAlerts: AlertRule[] = [
      {
        id: "mpesa_timeout_high",
        name: "High M-Pesa Timeout Rate",
        metric: "mpesa_timeout_rate",
        condition: "greater_than",
        threshold: 0.1, // 10%
        severity: "critical",
        isActive: true,
      },
      {
        id: "ussd_session_long",
        name: "Long USSD Session Duration",
        metric: "ussd_session_duration_90th",
        condition: "greater_than",
        threshold: 180, // 3 minutes
        county: "western",
        severity: "medium",
        isActive: true,
      },
      {
        id: "rural_ussd_drops",
        name: "High USSD Drop Rate - Rural Areas",
        metric: "ussd_error_rate",
        condition: "greater_than",
        threshold: 0.3, // 30%
        severity: "high",
        isActive: true,
      },
      {
        id: "core_web_vitals_poor",
        name: "Poor Core Web Vitals",
        metric: "lcp",
        condition: "greater_than",
        threshold: 4000, // 4 seconds
        severity: "medium",
        isActive: true,
      },
    ];

    defaultAlerts.forEach((alert) => {
      this.alerts.set(alert.id, alert);
    });
  }

  // Metrics Collection
  recordMetric(
    name: string,
    value: number,
    unit: string,
    labels: Record<string, string> = {},
    county?: string,
  ): void {
    const metric: KenyanMetric = {
      name,
      value,
      unit,
      county,
      timestamp: Date.now(),
      labels,
    };

    const metricKey = `${name}_${county || "global"}`;
    const existingMetrics = this.metrics.get(metricKey) || [];
    existingMetrics.push(metric);

    // Keep only last 1000 data points per metric
    if (existingMetrics.length > 1000) {
      existingMetrics.splice(0, existingMetrics.length - 1000);
    }

    this.metrics.set(metricKey, existingMetrics);

    // Check alerts
    this.checkAlerts(name, value, county);

    console.log(
      `📊 Metric recorded: ${name}=${value}${unit} (${county || "global"})`,
    );
  }

  // Kenyan-specific metric recording methods
  recordMpesaMetrics(county: string, timeouts: number, total: number): void {
    const timeoutRate = total > 0 ? timeouts / total : 0;
    this.recordMetric(
      "mpesa_timeout_rate",
      timeoutRate,
      "ratio",
      {
        provider: "safaricom",
      },
      county,
    );

    this.recordMetric("mpesa_transactions_total", total, "count", {}, county);
    this.recordMetric("mpesa_timeouts_total", timeouts, "count", {}, county);
  }

  recordUssdMetrics(
    county: string,
    sessionDuration: number,
    dropRate: number,
  ): void {
    this.recordMetric(
      "ussd_session_duration_90th",
      sessionDuration,
      "seconds",
      {},
      county,
    );
    this.recordMetric("ussd_error_rate", dropRate, "ratio", {}, county);

    // Record special metrics for rural areas
    if (["western", "nyanza", "northern"].includes(county.toLowerCase())) {
      this.recordMetric(
        "rural_ussd_performance",
        sessionDuration,
        "seconds",
        {
          area_type: "rural",
        },
        county,
      );
    }
  }

  recordCoreWebVitals(vitals: Omit<CoreWebVitals, "timestamp">): void {
    const fullVitals: CoreWebVitals = {
      ...vitals,
      timestamp: Date.now(),
    };

    this.webVitals.push(fullVitals);

    // Keep only last 1000 entries
    if (this.webVitals.length > 1000) {
      this.webVitals = this.webVitals.slice(-1000);
    }

    // Record individual metrics
    this.recordMetric(
      "lcp",
      vitals.lcp,
      "ms",
      {
        connection: vitals.connectionType,
      },
      vitals.county,
    );

    this.recordMetric(
      "fid",
      vitals.fid,
      "ms",
      {
        connection: vitals.connectionType,
      },
      vitals.county,
    );

    this.recordMetric(
      "cls",
      vitals.cls,
      "score",
      {
        connection: vitals.connectionType,
      },
      vitals.county,
    );

    this.recordMetric(
      "ttfb",
      vitals.ttfb,
      "ms",
      {
        connection: vitals.connectionType,
      },
      vitals.county,
    );
  }

  // Swahili Logging System
  log(
    level: SwahiliLogEntry["level"],
    swahiliMessage: string,
    englishMessage: string,
    context: SwahiliLogEntry["context"] = {},
    shengMessage?: string,
    metadata?: Record<string, any>,
  ): void {
    const logEntry: SwahiliLogEntry = {
      timestamp: Date.now(),
      level,
      message: swahiliMessage,
      english: englishMessage,
      sheng: shengMessage,
      context,
      metadata,
    };

    this.logs.push(logEntry);

    // Keep only last 5000 log entries
    if (this.logs.length > 5000) {
      this.logs = this.logs.slice(-5000);
    }

    // Console output with appropriate emoji
    const emoji = this.getLogEmoji(level);
    console.log(
      `${emoji} [${level.toUpperCase()}] ${swahiliMessage} | ${englishMessage}`,
    );

    if (shengMessage) {
      console.log(`   🗣️ Sheng: ${shengMessage}`);
    }
  }

  private getLogEmoji(level: string): string {
    const emojis = {
      info: "📝",
      warn: "⚠️",
      error: "🚨",
      debug: "🔍",
    };
    return emojis[level as keyof typeof emojis] || "📝";
  }

  // Convenience logging methods
  logInfo(
    swahiliMessage: string,
    englishMessage: string,
    context?: SwahiliLogEntry["context"],
    sheng?: string,
  ): void {
    this.log("info", swahiliMessage, englishMessage, context, sheng);
  }

  logWarn(
    swahiliMessage: string,
    englishMessage: string,
    context?: SwahiliLogEntry["context"],
    sheng?: string,
  ): void {
    this.log("warn", swahiliMessage, englishMessage, context, sheng);
  }

  logError(
    swahiliMessage: string,
    englishMessage: string,
    context?: SwahiliLogEntry["context"],
    sheng?: string,
  ): void {
    this.log("error", swahiliMessage, englishMessage, context, sheng);
  }

  logUserAction(action: string, userId: string, county: string): void {
    this.log(
      "info",
      `Mtumiaji amefanya kitendo: ${action}`,
      `User performed action: ${action}`,
      { userId, county, service: "user_interface" },
      `Msee amedo ${action}`,
    );
  }

  logPaymentEvent(
    transactionId: string,
    amount: string,
    county: string,
    success: boolean,
  ): void {
    if (success) {
      this.log(
        "info",
        `Malipo yamekamilika: ${amount}`,
        `Payment completed: ${amount}`,
        { transactionId, county, service: "payment" },
        `Pesa imeingia: ${amount}`,
      );
    } else {
      this.log(
        "error",
        `Malipo yameshindikana: ${amount}`,
        `Payment failed: ${amount}`,
        { transactionId, county, service: "payment" },
        `Pesa haijaingia: ${amount}`,
      );
    }
  }

  // Alert Management
  private checkAlerts(
    metricName: string,
    value: number,
    county?: string,
  ): void {
    this.alerts.forEach((alert, alertId) => {
      if (!alert.isActive || alert.metric !== metricName) return;

      // Check county filter
      if (alert.county && alert.county !== county) return;

      // Check condition
      let triggered = false;
      switch (alert.condition) {
        case "greater_than":
          triggered = value > alert.threshold;
          break;
        case "less_than":
          triggered = value < alert.threshold;
          break;
        case "equals":
          triggered = Math.abs(value - alert.threshold) < 0.001;
          break;
      }

      if (triggered) {
        this.triggerAlert(alert, value, county);
      }
    });
  }

  private triggerAlert(alert: AlertRule, value: number, county?: string): void {
    // Rate limit alerts (don't trigger same alert within 5 minutes)
    const now = Date.now();
    if (alert.lastTriggered && now - alert.lastTriggered < 300000) {
      return;
    }

    alert.lastTriggered = now;

    const alertMessage = this.generateAlertMessage(alert, value, county);

    this.log(
      "error",
      alertMessage.swahili,
      alertMessage.english,
      {
        alertId: alert.id,
        county,
        service: "monitoring",
        severity: alert.severity,
      },
      alertMessage.sheng,
    );

    // Would integrate with alerting systems (SMS, email, Slack)
    console.log(
      `🚨 ALERT TRIGGERED: ${alert.name} - Value: ${value}, Threshold: ${alert.threshold}`,
    );
  }

  private generateAlertMessage(
    alert: AlertRule,
    value: number,
    county?: string,
  ): {
    swahili: string;
    english: string;
    sheng: string;
  } {
    const location = county ? ` katika ${county}` : "";
    const severity = alert.severity === "critical" ? "HARAKA" : "Kumbuka";

    switch (alert.id) {
      case "mpesa_timeout_high":
        return {
          swahili: `${severity}: Kiwango cha matatizo ya M-Pesa kimeongezeka${location}`,
          english: `${severity}: M-Pesa timeout rate increased${location ? ` in ${county}` : ""}`,
          sheng: `${severity}: M-Pesa imejam${location}`,
        };

      case "ussd_session_long":
        return {
          swahili: `Mzunguko wa USSD umechukua muda mrefu${location}`,
          english: `USSD session duration is too long${location ? ` in ${county}` : ""}`,
          sheng: `USSD inachukua time mob${location}`,
        };

      default:
        return {
          swahili: `Onyo: ${alert.name} - Thamani: ${value}`,
          english: `Alert: ${alert.name} - Value: ${value}`,
          sheng: `Alert: ${alert.name} - Value: ${value}`,
        };
    }
  }

  // Distributed Tracing
  startTrace(traceId: string, operationName: string, county?: string): void {
    this.activeTraces.set(traceId, {
      id: traceId,
      operationName,
      county,
      startTime: Date.now(),
      spans: [],
    });

    this.logInfo(
      `Ufuatiliaji umeanza: ${operationName}`,
      `Trace started: ${operationName}`,
      { traceId, county, service: "tracing" },
    );
  }

  addSpan(traceId: string, spanName: string, duration: number): void {
    const trace = this.activeTraces.get(traceId);
    if (trace) {
      trace.spans.push({
        name: spanName,
        duration,
        timestamp: Date.now(),
      });
    }
  }

  endTrace(traceId: string): void {
    const trace = this.activeTraces.get(traceId);
    if (trace) {
      const totalDuration = Date.now() - trace.startTime;

      this.recordMetric(
        "trace_duration",
        totalDuration,
        "ms",
        {
          operation: trace.operationName,
        },
        trace.county,
      );

      this.logInfo(
        `Ufuatiliaji umekamilika: ${trace.operationName} (${totalDuration}ms)`,
        `Trace completed: ${trace.operationName} (${totalDuration}ms)`,
        { traceId, service: "tracing" },
      );

      this.activeTraces.delete(traceId);
    }
  }

  // Background processing
  private startMetricsCollection(): void {
    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);

    // Process web vitals every minute
    setInterval(() => {
      this.processWebVitalsMetrics();
    }, 60000);
  }

  private collectSystemMetrics(): void {
    // Simulate collection of system metrics
    const counties = ["nairobi", "mombasa", "kisumu", "nakuru", "eldoret"];

    counties.forEach((county) => {
      // Simulate M-Pesa metrics
      const mpesaTotal = Math.floor(Math.random() * 1000) + 100;
      const mpesaTimeouts = Math.floor(Math.random() * mpesaTotal * 0.1);
      this.recordMpesaMetrics(county, mpesaTimeouts, mpesaTotal);

      // Simulate USSD metrics
      const ussdDuration = Math.random() * 300 + 30; // 30-330 seconds
      const ussdDropRate = Math.random() * 0.4; // 0-40%
      this.recordUssdMetrics(county, ussdDuration, ussdDropRate);

      // Simulate general performance metrics
      this.recordMetric(
        "cpu_usage",
        Math.random() * 100,
        "percent",
        {},
        county,
      );
      this.recordMetric(
        "memory_usage",
        Math.random() * 100,
        "percent",
        {},
        county,
      );
      this.recordMetric(
        "active_users",
        Math.floor(Math.random() * 10000) + 1000,
        "count",
        {},
        county,
      );
    });
  }

  private processWebVitalsMetrics(): void {
    // Analyze Core Web Vitals trends
    const recentVitals = this.webVitals.filter(
      (vitals) => Date.now() - vitals.timestamp < 300000, // Last 5 minutes
    );

    const countyGroups = this.groupBy(recentVitals, "county");

    Object.entries(countyGroups).forEach(([county, vitals]) => {
      if (vitals.length === 0) return;

      const avgLcp = vitals.reduce((sum, v) => sum + v.lcp, 0) / vitals.length;
      const avgFid = vitals.reduce((sum, v) => sum + v.fid, 0) / vitals.length;

      this.recordMetric(
        "avg_lcp_5min",
        avgLcp,
        "ms",
        { period: "5min" },
        county,
      );
      this.recordMetric(
        "avg_fid_5min",
        avgFid,
        "ms",
        { period: "5min" },
        county,
      );
    });
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
      (groups, item) => {
        const group = String(item[key]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
      },
      {} as Record<string, T[]>,
    );
  }

  // Public query methods
  getMetrics(
    metricName?: string,
    county?: string,
    timeRange?: number,
  ): KenyanMetric[] {
    const now = Date.now();
    const cutoff = timeRange ? now - timeRange : 0;

    let allMetrics: KenyanMetric[] = [];

    this.metrics.forEach((metrics, key) => {
      const [name, metricCounty] = key.split("_");

      if (metricName && name !== metricName) return;
      if (county && metricCounty !== county && metricCounty !== "global")
        return;

      const filteredMetrics = metrics.filter((m) => m.timestamp >= cutoff);
      allMetrics = allMetrics.concat(filteredMetrics);
    });

    return allMetrics.sort((a, b) => b.timestamp - a.timestamp);
  }

  getLogs(
    level?: SwahiliLogEntry["level"],
    county?: string,
    timeRange?: number,
  ): SwahiliLogEntry[] {
    const now = Date.now();
    const cutoff = timeRange ? now - timeRange : 0;

    return this.logs
      .filter((log) => {
        if (level && log.level !== level) return false;
        if (county && log.context.county !== county) return false;
        if (log.timestamp < cutoff) return false;
        return true;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getWebVitalsReport(county?: string): {
    averages: { lcp: number; fid: number; cls: number; ttfb: number };
    trends: { improving: number; degrading: number; stable: number };
    byConnection: Record<string, { lcp: number; fid: number }>;
  } {
    const relevantVitals = county
      ? this.webVitals.filter((v) => v.county === county)
      : this.webVitals;

    if (relevantVitals.length === 0) {
      return {
        averages: { lcp: 0, fid: 0, cls: 0, ttfb: 0 },
        trends: { improving: 0, degrading: 0, stable: 0 },
        byConnection: {},
      };
    }

    // Calculate averages
    const averages = {
      lcp:
        relevantVitals.reduce((sum, v) => sum + v.lcp, 0) /
        relevantVitals.length,
      fid:
        relevantVitals.reduce((sum, v) => sum + v.fid, 0) /
        relevantVitals.length,
      cls:
        relevantVitals.reduce((sum, v) => sum + v.cls, 0) /
        relevantVitals.length,
      ttfb:
        relevantVitals.reduce((sum, v) => sum + v.ttfb, 0) /
        relevantVitals.length,
    };

    // Group by connection type
    const byConnection = this.groupBy(relevantVitals, "connectionType");
    const connectionStats: Record<string, { lcp: number; fid: number }> = {};

    Object.entries(byConnection).forEach(([connection, vitals]) => {
      connectionStats[connection] = {
        lcp: vitals.reduce((sum, v) => sum + v.lcp, 0) / vitals.length,
        fid: vitals.reduce((sum, v) => sum + v.fid, 0) / vitals.length,
      };
    });

    return {
      averages,
      trends: { improving: 45, degrading: 20, stable: 35 }, // Simulated trends
      byConnection: connectionStats,
    };
  }

  getSystemHealth(): {
    status: "healthy" | "degraded" | "critical";
    details: Record<string, any>;
    recommendations: string[];
  } {
    const recentMetrics = this.getMetrics(undefined, undefined, 300000); // Last 5 minutes
    const recentErrors = this.getLogs("error", undefined, 300000);

    let status: "healthy" | "degraded" | "critical" = "healthy";
    const details: Record<string, any> = {};
    const recommendations: string[] = [];

    // Check error rate
    const errorRate = recentErrors.length / Math.max(recentMetrics.length, 1);
    if (errorRate > 0.1) {
      status = "critical";
      recommendations.push("Investigate high error rate in logs");
    } else if (errorRate > 0.05) {
      status = "degraded";
      recommendations.push("Monitor error trends closely");
    }

    details.errorRate = errorRate;
    details.recentErrors = recentErrors.length;
    details.activeTraces = this.activeTraces.size;
    details.alertsTriggered = Array.from(this.alerts.values()).filter(
      (a) => a.lastTriggered,
    ).length;

    return { status, details, recommendations };
  }
}

export const observabilityService = new ObservabilityService();
export default observabilityService;
