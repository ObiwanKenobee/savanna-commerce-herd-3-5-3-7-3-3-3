import { savannaCommandCenter } from "./savannaCommandCenterService";
import { supabase } from "../integrations/supabase/client";

export type DashboardSubscriptionCallback = (data: any) => void;

class RealTimeDashboardService {
  private subscriptions: Map<string, DashboardSubscriptionCallback> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private ussdSyncInterval: NodeJS.Timeout | null = null;

  // Start real-time polling for dashboard data
  startDashboardPolling(callback: DashboardSubscriptionCallback): string {
    const subscriptionId = `dashboard_${Date.now()}_${Math.random()}`;

    this.subscriptions.set(subscriptionId, callback);

    // Initial data load
    this.fetchAndNotify(subscriptionId);

    // Set up 15-second polling
    const interval = setInterval(() => {
      this.fetchAndNotify(subscriptionId);
    }, 15000);

    this.pollingIntervals.set(subscriptionId, interval);

    // Set up USSD sync (60 seconds)
    if (!this.ussdSyncInterval) {
      this.ussdSyncInterval = setInterval(() => {
        this.syncUSSDData();
      }, 60000);
    }

    return subscriptionId;
  }

  // Stop polling for a specific subscription
  stopDashboardPolling(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);

    const interval = this.pollingIntervals.get(subscriptionId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(subscriptionId);
    }

    // If no more subscriptions, stop USSD sync
    if (this.subscriptions.size === 0 && this.ussdSyncInterval) {
      clearInterval(this.ussdSyncInterval);
      this.ussdSyncInterval = null;
    }
  }

  // Subscribe to specific alerts in real-time
  subscribeToAlerts(callback: (alert: any) => void): () => void {
    const channel = supabase
      .channel("admin_alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_alerts",
        },
        (payload) => {
          const alert = {
            id: payload.new.id,
            priority: payload.new.priority,
            title: payload.new.title,
            message: payload.new.message,
            county: payload.new.county,
            requiresHuman: payload.new.requires_human,
            ussdFallback: payload.new.ussd_fallback,
            timestamp: new Date(payload.new.timestamp),
            resolved: payload.new.resolved,
          };

          callback(alert);

          // Play alert sound based on priority
          this.playAlertSound(alert.priority);

          // Show browser notification if permitted
          this.showBrowserNotification(alert);
        },
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Subscribe to M-Pesa transaction failures
  subscribeToMPesaFailures(callback: (failure: any) => void): () => void {
    const channel = supabase
      .channel("mpesa_failures")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mpesa_transaction_failures",
        },
        (payload) => {
          callback(payload.new);

          // Auto-escalate after 3 retries
          if (payload.new.retry_count >= 3) {
            this.escalateToSafaricom(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Subscribe to fraud detection events
  subscribeToFraudDetection(callback: (fraud: any) => void): () => void {
    const channel = supabase
      .channel("fraud_detection")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "fraud_detections",
        },
        (payload) => {
          callback(payload.new);

          // Auto-freeze suspicious accounts if SIM card violations > 5%
          if (
            payload.new.violation_type === "sim_card_age" &&
            payload.new.violation_rate > 0.05
          ) {
            this.autoFreezeSuspiciousAccounts(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Monitor inventory levels and trigger alerts
  subscribeToInventoryAlerts(callback: (alert: any) => void): () => void {
    const channel = supabase
      .channel("inventory_alerts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventory_levels",
        },
        async (payload) => {
          // Check if stock level is critically low
          if (
            payload.new &&
            payload.new.stock_level < payload.new.reorder_point
          ) {
            const alert = await savannaCommandCenter.createAlert({
              priority: "elephant",
              title: "Critical Stock Level",
              message: `${payload.new.product_name} stock critically low in ${payload.new.county}`,
              county: payload.new.county,
              requiresHuman: true,
              ussdFallback: "*384*STOCK#",
            });

            callback(alert);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Private methods
  private async fetchAndNotify(subscriptionId: string): Promise<void> {
    try {
      const callback = this.subscriptions.get(subscriptionId);
      if (!callback) return;

      const data = await savannaCommandCenter.getDashboardOverview();
      callback(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  private async syncUSSDData(): Promise<void> {
    try {
      console.log("🔄 Syncing USSD data...");

      // Trigger USSD data synchronization
      await supabase.rpc("sync_ussd_data");

      console.log("✅ USSD data sync completed");
    } catch (error) {
      console.error("❌ USSD data sync failed:", error);

      // Create alert for failed sync
      await savannaCommandCenter.createAlert({
        priority: "elephant",
        title: "USSD Sync Failed",
        message: "Automatic USSD data synchronization failed",
        requiresHuman: true,
        ussdFallback: "*384*SYNC#",
      });
    }
  }

  private playAlertSound(priority: string): void {
    // Play different sounds based on alert priority
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const frequencies = {
      lion: [800, 600, 400], // Critical - descending urgent tone
      elephant: [400, 500, 400], // High - medium urgency
      tortoise: [300, 350, 300], // Low - gentle notification
    };

    const freq =
      frequencies[priority as keyof typeof frequencies] || frequencies.tortoise;

    freq.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }, index * 200);
    });
  }

  private showBrowserNotification(alert: any): void {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(
        `${alert.priority.toUpperCase()} Alert`,
        {
          body: alert.message,
          icon: this.getAlertIcon(alert.priority),
          badge: "/favicon.ico",
          tag: alert.id,
          requireInteraction: alert.priority === "lion",
        },
      );

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds for non-critical alerts
      if (alert.priority !== "lion") {
        setTimeout(() => notification.close(), 10000);
      }
    }
  }

  private getAlertIcon(priority: string): string {
    const icons = {
      lion: "🦁",
      elephant: "🐘",
      tortoise: "🐢",
    };

    // Convert emoji to data URL (simplified)
    const emoji = icons[priority as keyof typeof icons] || "⚠️";
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="50">${emoji}</text></svg>`;
  }

  private async escalateToSafaricom(failure: any): Promise<void> {
    console.log(
      "🚨 Escalating M-Pesa failure to Safaricom NOC:",
      failure.transaction_id,
    );

    // Create high-priority alert
    await savannaCommandCenter.createAlert({
      priority: "lion",
      title: "M-Pesa Escalation",
      message: `Transaction ${failure.transaction_id} escalated to Safaricom NOC after 3 retries`,
      requiresHuman: true,
      ussdFallback: "*384*MPESA#",
    });

    // In production, integrate with Safaricom's NOC API
    // await safaricomNOC.reportFailure(failure);
  }

  private async autoFreezeSuspiciousAccounts(fraudData: any): Promise<void> {
    console.log(
      "🔒 Auto-freezing suspicious accounts due to SIM card violations",
    );

    // Get accounts with young SIM cards
    const { data: suspiciousAccounts } = await supabase
      .from("users")
      .select("id, phone")
      .lt("sim_card_age_days", 90); // Less than 90 days

    if (suspiciousAccounts) {
      // Freeze accounts
      await supabase
        .from("users")
        .update({
          account_status: "frozen",
          frozen_reason: "sim_card_age_violation",
        })
        .in(
          "id",
          suspiciousAccounts.map((acc) => acc.id),
        );

      // Create alert
      await savannaCommandCenter.createAlert({
        priority: "elephant",
        title: "Accounts Auto-Frozen",
        message: `${suspiciousAccounts.length} accounts frozen due to SIM card age violations`,
        requiresHuman: true,
        ussdFallback: "*384*REVIEW#",
      });
    }
  }

  // Request browser notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }

  // Health check for real-time services
  async healthCheck(): Promise<{
    status: "healthy" | "degraded" | "unhealthy";
    services: {
      polling: boolean;
      ussdSync: boolean;
      supabaseConnection: boolean;
    };
  }> {
    const services = {
      polling: this.pollingIntervals.size > 0,
      ussdSync: this.ussdSyncInterval !== null,
      supabaseConnection: false,
    };

    // Test Supabase connection
    try {
      await supabase.from("admin_alerts").select("count").limit(1);
      services.supabaseConnection = true;
    } catch (error) {
      console.error("Supabase connection failed:", error);
    }

    const healthyServices = Object.values(services).filter(Boolean).length;
    const totalServices = Object.keys(services).length;

    let status: "healthy" | "degraded" | "unhealthy";
    if (healthyServices === totalServices) {
      status = "healthy";
    } else if (healthyServices >= totalServices / 2) {
      status = "degraded";
    } else {
      status = "unhealthy";
    }

    return { status, services };
  }
}

export const realTimeDashboard = new RealTimeDashboardService();
