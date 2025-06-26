/**
 * Security Infrastructure Service - Zero-Trust Security with SPIFFE
 * M-Pesa Number → SPIFFE ID → OpenPolicyAgent → Microservice
 * Kenyan-first security architecture with mobile-first identity
 */

export interface SpiffeIdentity {
  id: string;
  mpesaNumber: string;
  trust_domain: string;
  path: string;
  issued_at: number;
  expires_at: number;
  verified: boolean;
  county: string;
  user_tier: "basic" | "verified" | "premium" | "enterprise";
}

export interface PolicyDecision {
  allowed: boolean;
  reason: string;
  policy_name: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
  audit_log_id: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  rule: string;
  priority: number;
  county_specific?: string;
  mpesa_tier_required?: string;
  active: boolean;
  created_at: number;
}

export interface SecurityAlert {
  id: string;
  type:
    | "fraud_detection"
    | "policy_violation"
    | "identity_theft"
    | "unusual_access";
  severity: "low" | "medium" | "high" | "critical";
  mpesa_number: string;
  spiffe_id: string;
  message: string;
  swahili_message: string;
  details: Record<string, any>;
  timestamp: number;
  resolved: boolean;
}

export interface MpesaVerification {
  phone_number: string;
  verification_code: string;
  pin_hash: string;
  sim_age_days: number;
  last_transaction: number;
  fraud_score: number;
  county: string;
  network_provider: "safaricom" | "airtel" | "telkom";
}

class SecurityInfrastructureService {
  private spiffeIdentities: Map<string, SpiffeIdentity> = new Map();
  private securityPolicies: Map<string, SecurityPolicy> = new Map();
  private securityAlerts: SecurityAlert[] = [];
  private auditLogs: any[] = [];
  private fraudDetectionRules: Map<string, any> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
    this.initializeFraudDetectionRules();
    this.startSecurityMonitoring();
  }

  private initializeDefaultPolicies(): void {
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: "mpesa_authentication_required",
        name: "M-Pesa Authentication Required",
        description: "All users must authenticate via M-Pesa number",
        rule: `
          package savannah.auth
          default allow = false
          allow {
            input.mpesa_verified == true
            input.spiffe_id != ""
            input.sim_age_days >= 90
          }
        `,
        priority: 100,
        active: true,
        created_at: Date.now(),
      },
      {
        id: "location_consistency_check",
        name: "Location Consistency Validation",
        description: "Block sudden location jumps (Nairobi → Mombasa in 1hr)",
        rule: `
          package savannah.location
          default allow = true
          allow = false {
            distance_km := geo.distance(input.last_location, input.current_location)
            time_diff_hours := (input.current_time - input.last_access_time) / 3600
            speed := distance_km / time_diff_hours
            speed > 100  # Faster than matatu/bus travel
          }
        `,
        priority: 90,
        active: true,
        created_at: Date.now(),
      },
      {
        id: "high_value_transaction_review",
        name: "High Value Transaction Review",
        description: "Flag orders >10x median for new SIM cards",
        rule: `
          package savannah.transactions
          default allow = true
          allow = false {
            input.order_amount > (input.user_median_order * 10)
            input.sim_age_days < 90
          }
        `,
        priority: 80,
        county_specific: "all",
        mpesa_tier_required: "verified",
        active: true,
        created_at: Date.now(),
      },
      {
        id: "rural_area_ussd_priority",
        name: "Rural Area USSD Priority Access",
        description: "Prioritize USSD access in western/nyanza regions",
        rule: `
          package savannah.ussd
          default priority = "normal"
          priority = "high" {
            input.county in ["western", "nyanza", "northern"]
            input.connection_type == "ussd"
          }
        `,
        priority: 70,
        county_specific: "rural",
        active: true,
        created_at: Date.now(),
      },
    ];

    defaultPolicies.forEach((policy) => {
      this.securityPolicies.set(policy.id, policy);
    });
  }

  private initializeFraudDetectionRules(): void {
    // Kenyan-specific fraud detection patterns
    this.fraudDetectionRules.set("new_sim_high_value", {
      name: "New SIM Card High Value Orders",
      pattern: (
        verification: MpesaVerification,
        orderAmount: number,
        medianOrder: number,
      ) => {
        return verification.sim_age_days < 90 && orderAmount > medianOrder * 10;
      },
      risk_score: 85,
      action: "block_and_review",
    });

    this.fraudDetectionRules.set("location_velocity", {
      name: "Impossible Location Velocity",
      pattern: (
        currentCounty: string,
        lastCounty: string,
        timeDiff: number,
      ) => {
        const distanceMap: Record<string, Record<string, number>> = {
          nairobi: { mombasa: 490, kisumu: 340, nakuru: 160 },
          mombasa: { nairobi: 490, kisumu: 580, nakuru: 420 },
          kisumu: { nairobi: 340, mombasa: 580, nakuru: 190 },
        };

        const distance = distanceMap[lastCounty]?.[currentCounty] || 0;
        const timeHours = timeDiff / (1000 * 60 * 60);
        const velocity = distance / timeHours;

        return velocity > 100; // Faster than realistic travel
      },
      risk_score: 90,
      action: "require_additional_verification",
    });

    this.fraudDetectionRules.set("unusual_mpesa_pattern", {
      name: "Unusual M-Pesa Transaction Pattern",
      pattern: (verification: MpesaVerification) => {
        const hoursSinceLastTransaction =
          (Date.now() - verification.last_transaction) / (1000 * 60 * 60);
        return verification.fraud_score > 70 || hoursSinceLastTransaction > 168; // 1 week
      },
      risk_score: 75,
      action: "enhanced_verification",
    });
  }

  // Core SPIFFE Identity Management
  async generateSpiffeIdentity(
    mpesaVerification: MpesaVerification,
  ): Promise<SpiffeIdentity> {
    const trustDomain = "savannah.marketplace.ke";
    const userPath = `/user/mpesa/${mpesaVerification.phone_number}`;

    // Determine user tier based on verification and history
    const userTier = this.determineUserTier(mpesaVerification);

    const spiffeId: SpiffeIdentity = {
      id: `spiffe://${trustDomain}${userPath}`,
      mpesaNumber: mpesaVerification.phone_number,
      trust_domain: trustDomain,
      path: userPath,
      issued_at: Date.now(),
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      verified: this.verifyMpesaCredentials(mpesaVerification),
      county: mpesaVerification.county,
      user_tier: userTier,
    };

    this.spiffeIdentities.set(spiffeId.id, spiffeId);

    this.logSecurityEvent("spiffe_identity_created", {
      spiffe_id: spiffeId.id,
      mpesa_number: mpesaVerification.phone_number,
      county: mpesaVerification.county,
      user_tier: userTier,
    });

    return spiffeId;
  }

  private determineUserTier(
    verification: MpesaVerification,
  ): "basic" | "verified" | "premium" | "enterprise" {
    if (verification.sim_age_days < 30) return "basic";
    if (verification.sim_age_days < 365 && verification.fraud_score < 20)
      return "verified";
    if (verification.sim_age_days >= 365 && verification.fraud_score < 10)
      return "premium";
    return "enterprise"; // Long-term users with excellent history
  }

  private verifyMpesaCredentials(verification: MpesaVerification): boolean {
    // Simulate M-Pesa credential verification
    if (verification.sim_age_days < 30) return false;
    if (verification.fraud_score > 80) return false;
    if (
      verification.network_provider !== "safaricom" &&
      verification.sim_age_days < 90
    )
      return false;

    return true;
  }

  // OpenPolicyAgent Integration
  async evaluatePolicy(
    spiffeId: string,
    resource: string,
    action: string,
    context: Record<string, any>,
  ): Promise<PolicyDecision> {
    const identity = this.spiffeIdentities.get(spiffeId);
    if (!identity) {
      return {
        allowed: false,
        reason: "Invalid SPIFFE identity",
        policy_name: "identity_validation",
        resource,
        action,
        audit_log_id: this.createAuditLog("policy_evaluation_failed", {
          spiffeId,
          resource,
          action,
        }),
      };
    }

    // Check if identity is expired
    if (Date.now() > identity.expires_at) {
      return {
        allowed: false,
        reason: "SPIFFE identity expired",
        policy_name: "identity_expiration",
        resource,
        action,
        audit_log_id: this.createAuditLog("identity_expired", {
          spiffeId,
          resource,
          action,
        }),
      };
    }

    // Evaluate security policies in priority order
    const sortedPolicies = Array.from(this.securityPolicies.values())
      .filter((p) => p.active)
      .sort((a, b) => b.priority - a.priority);

    for (const policy of sortedPolicies) {
      const decision = await this.evaluateSinglePolicy(
        policy,
        identity,
        resource,
        action,
        context,
      );
      if (!decision.allowed) {
        return decision;
      }
    }

    // All policies passed
    const auditLogId = this.createAuditLog("policy_evaluation_success", {
      spiffeId,
      resource,
      action,
      context,
    });

    return {
      allowed: true,
      reason: "All security policies satisfied",
      policy_name: "combined_evaluation",
      resource,
      action,
      audit_log_id: auditLogId,
    };
  }

  private async evaluateSinglePolicy(
    policy: SecurityPolicy,
    identity: SpiffeIdentity,
    resource: string,
    action: string,
    context: Record<string, any>,
  ): Promise<PolicyDecision> {
    // County-specific policy filtering
    if (
      policy.county_specific &&
      policy.county_specific !== "all" &&
      policy.county_specific !== identity.county
    ) {
      return {
        allowed: true,
        reason: "Policy not applicable to county",
        policy_name: policy.name,
        resource,
        action,
        audit_log_id: this.createAuditLog("policy_skipped", {
          policy: policy.id,
        }),
      };
    }

    // M-Pesa tier requirement check
    if (
      policy.mpesa_tier_required &&
      !this.checkTierRequirement(identity.user_tier, policy.mpesa_tier_required)
    ) {
      return {
        allowed: false,
        reason: `Insufficient user tier: ${identity.user_tier} < ${policy.mpesa_tier_required}`,
        policy_name: policy.name,
        resource,
        action,
        audit_log_id: this.createAuditLog("tier_requirement_failed", {
          spiffeId: identity.id,
          required: policy.mpesa_tier_required,
          actual: identity.user_tier,
        }),
      };
    }

    // Simulate OPA policy evaluation
    const policyResult = this.simulateOpaEvaluation(policy, identity, context);

    return {
      allowed: policyResult.allow,
      reason: policyResult.reason,
      policy_name: policy.name,
      resource,
      action,
      conditions: policyResult.conditions,
      audit_log_id: this.createAuditLog("policy_evaluated", {
        policy: policy.id,
        result: policyResult.allow,
        spiffeId: identity.id,
      }),
    };
  }

  private checkTierRequirement(
    userTier: string,
    requiredTier: string,
  ): boolean {
    const tierHierarchy = ["basic", "verified", "premium", "enterprise"];
    const userLevel = tierHierarchy.indexOf(userTier);
    const requiredLevel = tierHierarchy.indexOf(requiredTier);
    return userLevel >= requiredLevel;
  }

  private simulateOpaEvaluation(
    policy: SecurityPolicy,
    identity: SpiffeIdentity,
    context: Record<string, any>,
  ): { allow: boolean; reason: string; conditions?: Record<string, any> } {
    // Simulate different policy evaluations based on policy ID
    switch (policy.id) {
      case "mpesa_authentication_required":
        return {
          allow: identity.verified && identity.mpesaNumber.startsWith("254"),
          reason: identity.verified
            ? "M-Pesa authentication valid"
            : "M-Pesa authentication failed",
        };

      case "location_consistency_check":
        const lastLocation = context.last_location || identity.county;
        const currentLocation = context.current_location || identity.county;
        const locationConsistent = this.checkLocationConsistency(
          lastLocation,
          currentLocation,
          context.time_diff || 0,
        );
        return {
          allow: locationConsistent,
          reason: locationConsistent
            ? "Location change is reasonable"
            : "Suspicious location velocity detected",
        };

      case "high_value_transaction_review":
        const orderAmount = context.order_amount || 0;
        const medianOrder = context.user_median_order || 1000;
        const isHighValue = orderAmount > medianOrder * 10;
        const hasOldSim = context.sim_age_days >= 90;
        return {
          allow: !isHighValue || hasOldSim,
          reason:
            isHighValue && !hasOldSim
              ? "High value order from new SIM requires review"
              : "Transaction approved",
        };

      case "rural_area_ussd_priority":
        const isRuralCounty = ["western", "nyanza", "northern"].includes(
          identity.county,
        );
        const isUssdAccess = context.connection_type === "ussd";
        return {
          allow: true,
          reason: "USSD access evaluated",
          conditions: {
            priority: isRuralCounty && isUssdAccess ? "high" : "normal",
          },
        };

      default:
        return { allow: true, reason: "Default allow policy" };
    }
  }

  private checkLocationConsistency(
    lastLocation: string,
    currentLocation: string,
    timeDiff: number,
  ): boolean {
    if (lastLocation === currentLocation) return true;

    // Simplified distance calculation (in reality would use proper geo calculation)
    const distanceMap: Record<string, Record<string, number>> = {
      nairobi: { mombasa: 490, kisumu: 340, nakuru: 160 },
      mombasa: { nairobi: 490, kisumu: 580, nakuru: 420 },
      kisumu: { nairobi: 340, mombasa: 580, nakuru: 190 },
    };

    const distance = distanceMap[lastLocation]?.[currentLocation] || 100;
    const timeHours = timeDiff / (1000 * 60 * 60);
    const maxReasonableSpeed = 80; // km/h (accounting for matatu/bus travel)

    return distance / timeHours <= maxReasonableSpeed;
  }

  // Fraud Detection System
  async detectFraud(
    mpesaVerification: MpesaVerification,
    context: Record<string, any>,
  ): Promise<{
    isFraud: boolean;
    riskScore: number;
    reasons: string[];
    actions: string[];
  }> {
    const reasons: string[] = [];
    const actions: string[] = [];
    let totalRiskScore = 0;

    // Evaluate each fraud detection rule
    for (const [ruleId, rule] of this.fraudDetectionRules.entries()) {
      let ruleTriggered = false;

      switch (ruleId) {
        case "new_sim_high_value":
          const orderAmount = context.order_amount || 0;
          const medianOrder = context.user_median_order || 1000;
          ruleTriggered = rule.pattern(
            mpesaVerification,
            orderAmount,
            medianOrder,
          );
          break;

        case "location_velocity":
          const currentCounty =
            context.current_county || mpesaVerification.county;
          const lastCounty = context.last_county || mpesaVerification.county;
          const timeDiff = context.time_diff || 0;
          ruleTriggered = rule.pattern(currentCounty, lastCounty, timeDiff);
          break;

        case "unusual_mpesa_pattern":
          ruleTriggered = rule.pattern(mpesaVerification);
          break;
      }

      if (ruleTriggered) {
        totalRiskScore += rule.risk_score;
        reasons.push(rule.name);
        actions.push(rule.action);

        // Create security alert
        await this.createSecurityAlert({
          type: "fraud_detection",
          severity:
            rule.risk_score > 80
              ? "critical"
              : rule.risk_score > 60
                ? "high"
                : "medium",
          mpesa_number: mpesaVerification.phone_number,
          spiffe_id: `spiffe://savannah.marketplace.ke/user/mpesa/${mpesaVerification.phone_number}`,
          message: `Fraud detection rule triggered: ${rule.name}`,
          swahili_message: this.translateFraudMessage(rule.name),
          details: { rule: ruleId, risk_score: rule.risk_score, context },
        });
      }
    }

    const isFraud = totalRiskScore >= 80; // Threshold for fraud classification

    this.logSecurityEvent("fraud_detection_evaluation", {
      mpesa_number: mpesaVerification.phone_number,
      risk_score: totalRiskScore,
      is_fraud: isFraud,
      triggered_rules: reasons,
    });

    return {
      isFraud,
      riskScore: totalRiskScore,
      reasons,
      actions,
    };
  }

  private translateFraudMessage(ruleName: string): string {
    const translations: Record<string, string> = {
      "New SIM Card High Value Orders": "Simu mpya na oda kubwa - inashukiwa",
      "Impossible Location Velocity": "Mabadiliko ya mahali haraka mno",
      "Unusual M-Pesa Transaction Pattern":
        "Muundo wa ajabu wa malipo ya M-Pesa",
    };
    return translations[ruleName] || ruleName;
  }

  // Security Alert Management
  private async createSecurityAlert(
    alertData: Omit<SecurityAlert, "id" | "timestamp" | "resolved">,
  ): Promise<string> {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      resolved: false,
      ...alertData,
    };

    this.securityAlerts.push(alert);

    // Keep only last 1000 alerts
    if (this.securityAlerts.length > 1000) {
      this.securityAlerts = this.securityAlerts.slice(-1000);
    }

    console.log(`🚨 Security Alert Created: ${alert.type} - ${alert.message}`);

    return alert.id;
  }

  // Audit Logging
  private createAuditLog(event: string, details: Record<string, any>): string {
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const auditEntry = {
      id: auditId,
      event,
      details,
      timestamp: Date.now(),
      source: "security_infrastructure_service",
    };

    this.auditLogs.push(auditEntry);

    // Keep only last 5000 audit logs
    if (this.auditLogs.length > 5000) {
      this.auditLogs = this.auditLogs.slice(-5000);
    }

    return auditId;
  }

  private logSecurityEvent(event: string, details: Record<string, any>): void {
    console.log(`🔒 Security Event: ${event}`, details);
    this.createAuditLog(event, details);
  }

  // Background Security Monitoring
  private startSecurityMonitoring(): void {
    setInterval(() => {
      this.cleanupExpiredIdentities();
      this.analyzeThreatPatterns();
    }, 60000); // Every minute
  }

  private cleanupExpiredIdentities(): void {
    const now = Date.now();
    const expiredIdentities: string[] = [];

    this.spiffeIdentities.forEach((identity, spiffeId) => {
      if (now > identity.expires_at) {
        expiredIdentities.push(spiffeId);
      }
    });

    expiredIdentities.forEach((spiffeId) => {
      this.spiffeIdentities.delete(spiffeId);
      this.logSecurityEvent("spiffe_identity_expired", { spiffe_id: spiffeId });
    });

    if (expiredIdentities.length > 0) {
      console.log(
        `🗑️ Cleaned up ${expiredIdentities.length} expired SPIFFE identities`,
      );
    }
  }

  private analyzeThreatPatterns(): void {
    const recentAlerts = this.securityAlerts.filter(
      (alert) => !alert.resolved && Date.now() - alert.timestamp < 3600000, // Last hour
    );

    // Group alerts by type and county
    const alertPatterns: Record<string, Record<string, number>> = {};

    recentAlerts.forEach((alert) => {
      const county = alert.details?.county || "unknown";
      if (!alertPatterns[alert.type]) {
        alertPatterns[alert.type] = {};
      }
      alertPatterns[alert.type][county] =
        (alertPatterns[alert.type][county] || 0) + 1;
    });

    // Detect suspicious patterns
    Object.entries(alertPatterns).forEach(([alertType, countyData]) => {
      Object.entries(countyData).forEach(([county, count]) => {
        if (count >= 5) {
          // 5+ alerts of same type in same county
          this.createSecurityAlert({
            type: "unusual_access",
            severity: "high",
            mpesa_number: "system",
            spiffe_id: "system",
            message: `Unusual pattern detected: ${count} ${alertType} alerts in ${county}`,
            swahili_message: `Muundo wa ajabu: tukio ${count} za aina ${alertType} katika ${county}`,
            details: {
              pattern_type: "geographic_clustering",
              alert_type: alertType,
              county,
              count,
            },
          });
        }
      });
    });
  }

  // Public API Methods
  getActiveIdentities(): SpiffeIdentity[] {
    const now = Date.now();
    return Array.from(this.spiffeIdentities.values()).filter(
      (identity) => now <= identity.expires_at,
    );
  }

  getSecurityAlerts(resolved: boolean = false): SecurityAlert[] {
    return this.securityAlerts.filter((alert) => alert.resolved === resolved);
  }

  getSecurityPolicies(): SecurityPolicy[] {
    return Array.from(this.securityPolicies.values());
  }

  getAuditLogs(timeRange?: number): any[] {
    const cutoff = timeRange ? Date.now() - timeRange : 0;
    return this.auditLogs.filter((log) => log.timestamp >= cutoff);
  }

  async resolveSecurityAlert(
    alertId: string,
    resolution: string,
  ): Promise<boolean> {
    const alert = this.securityAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.logSecurityEvent("security_alert_resolved", {
        alert_id: alertId,
        resolution,
      });
      return true;
    }
    return false;
  }

  getSecurityMetrics(): {
    active_identities: number;
    pending_alerts: number;
    fraud_detection_rate: number;
    policy_violations_24h: number;
    counties_monitored: number;
  } {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;

    const activeIdentities = this.getActiveIdentities().length;
    const pendingAlerts = this.getSecurityAlerts(false).length;
    const recentAudits = this.auditLogs.filter(
      (log) => log.timestamp >= last24h,
    );
    const fraudDetections = recentAudits.filter(
      (log) => log.event === "fraud_detection_evaluation",
    ).length;
    const policyViolations = recentAudits.filter(
      (log) => log.event === "policy_evaluation_failed",
    ).length;

    const countiesMonitored = new Set(
      Array.from(this.spiffeIdentities.values()).map((id) => id.county),
    ).size;

    return {
      active_identities: activeIdentities,
      pending_alerts: pendingAlerts,
      fraud_detection_rate:
        recentAudits.length > 0
          ? (fraudDetections / recentAudits.length) * 100
          : 0,
      policy_violations_24h: policyViolations,
      counties_monitored: countiesMonitored,
    };
  }

  // Simulate real-world security flow
  async simulateSecurityFlow(
    mpesaNumber: string,
    county: string,
    orderAmount: number,
  ): Promise<{
    spiffe_identity: SpiffeIdentity;
    policy_decision: PolicyDecision;
    fraud_result: any;
    final_decision: "allow" | "deny" | "review";
  }> {
    console.log(`🔐 Starting security flow for M-Pesa: ${mpesaNumber}`);

    // Step 1: M-Pesa Verification
    const mpesaVerification: MpesaVerification = {
      phone_number: mpesaNumber,
      verification_code: "123456",
      pin_hash: "hashed_pin",
      sim_age_days: Math.floor(Math.random() * 365) + 30,
      last_transaction: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      fraud_score: Math.floor(Math.random() * 50),
      county,
      network_provider: "safaricom",
    };

    // Step 2: Generate SPIFFE Identity
    const spiffeIdentity = await this.generateSpiffeIdentity(mpesaVerification);

    // Step 3: Fraud Detection
    const fraudResult = await this.detectFraud(mpesaVerification, {
      order_amount: orderAmount,
      user_median_order: 2500,
      current_county: county,
      sim_age_days: mpesaVerification.sim_age_days,
    });

    // Step 4: Policy Evaluation
    const policyDecision = await this.evaluatePolicy(
      spiffeIdentity.id,
      "marketplace/orders",
      "create",
      {
        order_amount: orderAmount,
        user_median_order: 2500,
        sim_age_days: mpesaVerification.sim_age_days,
        connection_type: "mobile_app",
      },
    );

    // Step 5: Final Decision
    let finalDecision: "allow" | "deny" | "review" = "allow";

    if (fraudResult.isFraud) {
      finalDecision = "deny";
    } else if (!policyDecision.allowed) {
      finalDecision = "deny";
    } else if (fraudResult.riskScore > 50) {
      finalDecision = "review";
    }

    console.log(
      `✅ Security flow completed: ${finalDecision} for ${mpesaNumber}`,
    );

    return {
      spiffe_identity: spiffeIdentity,
      policy_decision: policyDecision,
      fraud_result: fraudResult,
      final_decision: finalDecision,
    };
  }
}

export const securityInfrastructureService =
  new SecurityInfrastructureService();
export default securityInfrastructureService;
