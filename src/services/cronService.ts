/**
 * 🦁 Savanna Marketplace - Adaptive Cron Service
 * Dynamically handles cron job scheduling based on account tier
 * Switches between daily (hobby) and high-frequency (pro) schedules
 */

export interface CronJob {
  id: string;
  name: string;
  path: string;
  hobbySchedule: string; // Daily for hobby accounts
  proSchedule: string; // High frequency for pro accounts
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  enabled: boolean;
}

export interface CronConfiguration {
  isProAccount: boolean;
  platform: "vercel" | "render" | "aws" | "custom";
  timezone: string;
  retryAttempts: number;
  timeoutMs: number;
}

// Default cron jobs configuration
export const DEFAULT_CRON_JOBS: CronJob[] = [
  {
    id: "daily-analytics",
    name: "Daily Analytics Processing",
    path: "/api/cron/daily-analytics",
    hobbySchedule: "0 2 * * *", // 2 AM daily (hobby)
    proSchedule: "0 */4 * * *", // Every 4 hours (pro)
    description: "Process daily analytics, user metrics, and performance data",
    priority: "critical",
    enabled: true,
  },
  {
    id: "inventory-sync",
    name: "Inventory Synchronization",
    path: "/api/cron/inventory-sync",
    hobbySchedule: "0 6 * * *", // 6 AM daily (hobby)
    proSchedule: "*/15 * * * *", // Every 15 minutes (pro)
    description: "Sync inventory levels across all suppliers and warehouses",
    priority: "critical",
    enabled: true,
  },
  {
    id: "price-updates",
    name: "Dynamic Price Updates",
    path: "/api/cron/price-updates",
    hobbySchedule: "0 8 * * *", // 8 AM daily (hobby)
    proSchedule: "0 */2 * * *", // Every 2 hours (pro)
    description: "Update pricing based on market conditions and demand",
    priority: "high",
    enabled: true,
  },
  {
    id: "order-reconciliation",
    name: "Order Reconciliation",
    path: "/api/cron/order-reconciliation",
    hobbySchedule: "0 10 * * *", // 10 AM daily (hobby)
    proSchedule: "0 */6 * * *", // Every 6 hours (pro)
    description: "Reconcile orders, payments, and delivery statuses",
    priority: "critical",
    enabled: true,
  },
  {
    id: "fraud-detection",
    name: "Fraud Detection Scan",
    path: "/api/cron/fraud-detection",
    hobbySchedule: "0 12 * * *", // 12 PM daily (hobby)
    proSchedule: "*/30 * * * *", // Every 30 minutes (pro)
    description: "Run fraud detection algorithms on transactions",
    priority: "critical",
    enabled: true,
  },
  {
    id: "supplier-performance",
    name: "Supplier Performance Review",
    path: "/api/cron/supplier-performance",
    hobbySchedule: "0 14 * * *", // 2 PM daily (hobby)
    proSchedule: "0 */8 * * *", // Every 8 hours (pro)
    description: "Analyze supplier performance metrics and ratings",
    priority: "medium",
    enabled: true,
  },
  {
    id: "notification-digest",
    name: "Notification Digest",
    path: "/api/cron/notification-digest",
    hobbySchedule: "0 16 * * *", // 4 PM daily (hobby)
    proSchedule: "0 */1 * * *", // Every hour (pro)
    description: "Send batched notifications and updates to users",
    priority: "medium",
    enabled: true,
  },
  {
    id: "database-cleanup",
    name: "Database Cleanup",
    path: "/api/cron/database-cleanup",
    hobbySchedule: "0 23 * * *", // 11 PM daily (hobby)
    proSchedule: "0 4 * * *", // 4 AM daily (pro - still daily but different time)
    description: "Clean up expired sessions, logs, and temporary data",
    priority: "low",
    enabled: true,
  },
  {
    id: "backup-process",
    name: "Backup Process",
    path: "/api/cron/backup-process",
    hobbySchedule: "0 1 * * 0", // 1 AM weekly on Sunday (hobby)
    proSchedule: "0 0 * * *", // Midnight daily (pro)
    description: "Create backups of critical data and configurations",
    priority: "high",
    enabled: true,
  },
  {
    id: "market-insights",
    name: "Market Insights Generation",
    path: "/api/cron/market-insights",
    hobbySchedule: "0 18 * * *", // 6 PM daily (hobby)
    proSchedule: "0 */12 * * *", // Every 12 hours (pro)
    description: "Generate market trends and business insights",
    priority: "medium",
    enabled: true,
  },
];

export class CronService {
  private config: CronConfiguration;
  private jobs: CronJob[];

  constructor(config: CronConfiguration) {
    this.config = config;
    this.jobs = [...DEFAULT_CRON_JOBS];
  }

  /**
   * Get cron configuration for current account tier
   */
  getCronConfiguration(): any {
    const activeJobs = this.jobs.filter((job) => job.enabled);

    switch (this.config.platform) {
      case "vercel":
        return this.getVercelConfig(activeJobs);
      case "render":
        return this.getRenderConfig(activeJobs);
      case "aws":
        return this.getAWSConfig(activeJobs);
      default:
        return this.getGenericConfig(activeJobs);
    }
  }

  /**
   * Vercel cron configuration
   */
  private getVercelConfig(jobs: CronJob[]) {
    return {
      crons: jobs.map((job) => ({
        path: job.path,
        schedule: this.config.isProAccount
          ? job.proSchedule
          : job.hobbySchedule,
      })),
    };
  }

  /**
   * Render cron configuration
   */
  private getRenderConfig(jobs: CronJob[]) {
    return {
      cronJobs: jobs.map((job) => ({
        name: job.id,
        schedule: this.config.isProAccount
          ? job.proSchedule
          : job.hobbySchedule,
        command: `curl $RENDER_EXTERNAL_URL${job.path}`,
      })),
    };
  }

  /**
   * AWS EventBridge cron configuration
   */
  private getAWSConfig(jobs: CronJob[]) {
    return {
      rules: jobs.map((job) => ({
        Name: job.id.replace(/-/g, ""),
        Description: job.description,
        ScheduleExpression: `cron(${this.convertToCronExpression(
          this.config.isProAccount ? job.proSchedule : job.hobbySchedule,
        )})`,
        State: "ENABLED",
        Targets: [
          {
            Id: `${job.id}Target`,
            Arn: "${CronFunction.Arn}",
            Input: JSON.stringify({ task: job.id }),
          },
        ],
      })),
    };
  }

  /**
   * Generic cron configuration
   */
  private getGenericConfig(jobs: CronJob[]) {
    return {
      jobs: jobs.map((job) => ({
        id: job.id,
        name: job.name,
        schedule: this.config.isProAccount
          ? job.proSchedule
          : job.hobbySchedule,
        endpoint: job.path,
        description: job.description,
        priority: job.priority,
        retryAttempts: this.config.retryAttempts,
        timeoutMs: this.config.timeoutMs,
      })),
    };
  }

  /**
   * Convert cron expression to AWS format
   */
  private convertToCronExpression(schedule: string): string {
    // Convert from standard cron (5 fields) to AWS cron (6 fields with year)
    return schedule + " *";
  }

  /**
   * Get recommended upgrade message
   */
  getUpgradeRecommendation(): string {
    if (this.config.isProAccount) {
      return "🦁 You're on Pro! Enjoying high-frequency updates and real-time synchronization.";
    }

    const criticalJobs = this.jobs.filter(
      (job) => job.priority === "critical" && job.enabled,
    );
    const highFrequencyBenefits = criticalJobs
      .map((job) => `• ${job.name}: ${job.hobbySchedule} → ${job.proSchedule}`)
      .join("\n");

    return `
🦌 Current Hobby Plan Limitations:
${highFrequencyBenefits}

🦁 Upgrade to Pro for:
✅ Real-time inventory sync (every 15 min vs daily)
✅ Instant fraud detection (every 30 min vs daily)  
✅ Dynamic pricing updates (every 2 hours vs daily)
✅ Better customer experience with faster updates
✅ Higher revenue with optimal pricing and inventory

💰 Upgrade Cost: $20/month
📈 Expected ROI: 2-5x improvement in operational efficiency
    `;
  }

  /**
   * Validate cron schedule format
   */
  validateSchedule(schedule: string): boolean {
    // Basic validation for cron expression
    const parts = schedule.split(" ");
    return parts.length === 5 || parts.length === 6;
  }

  /**
   * Add custom cron job
   */
  addJob(job: Omit<CronJob, "id">): string {
    const id = job.name.toLowerCase().replace(/\s+/g, "-");
    const newJob: CronJob = { ...job, id };

    if (
      !this.validateSchedule(job.hobbySchedule) ||
      !this.validateSchedule(job.proSchedule)
    ) {
      throw new Error("Invalid cron schedule format");
    }

    this.jobs.push(newJob);
    return id;
  }

  /**
   * Remove cron job
   */
  removeJob(jobId: string): boolean {
    const index = this.jobs.findIndex((job) => job.id === jobId);
    if (index > -1) {
      this.jobs.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Enable/disable cron job
   */
  toggleJob(jobId: string, enabled: boolean): boolean {
    const job = this.jobs.find((job) => job.id === jobId);
    if (job) {
      job.enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Get next execution time for a job
   */
  getNextExecution(jobId: string): Date | null {
    const job = this.jobs.find((job) => job.id === jobId);
    if (!job || !job.enabled) return null;

    const schedule = this.config.isProAccount
      ? job.proSchedule
      : job.hobbySchedule;
    // This would integrate with a cron parser library in production
    // For now, return approximate next execution
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day
  }

  /**
   * Get all jobs with their schedules
   */
  getAllJobs(): Array<
    CronJob & { activeSchedule: string; nextExecution: Date | null }
  > {
    return this.jobs.map((job) => ({
      ...job,
      activeSchedule: this.config.isProAccount
        ? job.proSchedule
        : job.hobbySchedule,
      nextExecution: this.getNextExecution(job.id),
    }));
  }

  /**
   * Export configuration for deployment
   */
  exportConfig(): string {
    const config = this.getCronConfiguration();
    return JSON.stringify(config, null, 2);
  }

  /**
   * Detect platform from environment
   */
  static detectPlatform(): "vercel" | "render" | "aws" | "custom" {
    if (process.env.VERCEL) return "vercel";
    if (process.env.RENDER) return "render";
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "aws";
    return "custom";
  }

  /**
   * Create default configuration
   */
  static createDefaultConfig(isProAccount: boolean = false): CronConfiguration {
    return {
      isProAccount,
      platform: CronService.detectPlatform(),
      timezone: "Africa/Nairobi",
      retryAttempts: 3,
      timeoutMs: 30000,
    };
  }
}

// Export instance for immediate use
export const cronService = new CronService(CronService.createDefaultConfig());

// Helper function to check if pro features are available
export const isProAccount = (): boolean => {
  return (
    process.env.VITE_SUBSCRIPTION_TIER === "pro" ||
    process.env.VERCEL_PRO === "true" ||
    process.env.RENDER_PLAN === "starter" ||
    false
  );
};

// Update cron service based on detected account type
cronService.config.isProAccount = isProAccount();
