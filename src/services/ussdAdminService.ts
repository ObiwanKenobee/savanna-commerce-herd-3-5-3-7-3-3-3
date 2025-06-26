import { supabase } from "../integrations/supabase/client";
import { savannaCommandCenter } from "./savannaCommandCenterService";

export interface USSDAdminSession {
  sessionId: string;
  phoneNumber: string;
  currentStep: string;
  adminLevel: "super" | "regional" | "support";
  sessionData: Record<string, any>;
  expiresAt: Date;
}

export interface USSDAdminResponse {
  message: string;
  action: "continue" | "end";
  nextStep?: string;
}

class USSDAdminService {
  private readonly SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes for admin sessions
  private readonly ADMIN_SHORTCODES = {
    EMERGENCY_PRICE_CAP: "*384*CAP#",
    FORCE_INVENTORY_SYNC: "*384*SYNC#",
    BLACKLIST_SUPPLIER: "*384*BAN#",
    VIEW_ALERTS: "*384*ALERTS#",
    SYSTEM_STATUS: "*384*STATUS#",
    MPESA_CHECK: "*384*MPESA#",
    FRAUD_REVIEW: "*384*REVIEW#",
  };

  async handleUSSDAdminRequest(
    phoneNumber: string,
    input: string,
    sessionId?: string,
  ): Promise<USSDAdminResponse> {
    try {
      // Verify admin permissions
      const adminLevel = await this.verifyAdminPermissions(phoneNumber);
      if (!adminLevel) {
        return {
          message: "Samahani, huna ruhusa za kiongozi. Unauthorized access.",
          action: "end",
        };
      }

      // Get or create session
      let session = sessionId ? await this.getAdminSession(sessionId) : null;

      if (!session || this.isSessionExpired(session)) {
        session = await this.createAdminSession(phoneNumber, adminLevel);
        return this.handleAdminMainMenu(session, input);
      }

      // Route to appropriate handler
      switch (session.currentStep) {
        case "main_menu":
          return this.handleAdminMainMenu(session, input);
        case "view_alerts":
          return this.handleViewAlerts(session, input);
        case "price_cap":
          return this.handlePriceCap(session, input);
        case "price_cap_product":
          return this.handlePriceCapProduct(session, input);
        case "price_cap_amount":
          return this.handlePriceCapAmount(session, input);
        case "blacklist_supplier":
          return this.handleBlacklistSupplier(session, input);
        case "blacklist_reason":
          return this.handleBlacklistReason(session, input);
        case "system_status":
          return this.handleSystemStatus(session, input);
        default:
          return this.handleAdminMainMenu(session, input);
      }
    } catch (error) {
      console.error("USSD admin request failed:", error);
      return {
        message: "Kuna hitilafu ya mfumo. System error occurred.",
        action: "end",
      };
    }
  }

  private async verifyAdminPermissions(
    phoneNumber: string,
  ): Promise<string | null> {
    try {
      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("admin_level, is_active")
        .eq("phone", phoneNumber)
        .eq("is_active", true)
        .single();

      if (error || !admin) {
        return null;
      }

      return admin.admin_level;
    } catch (error) {
      console.error("Failed to verify admin permissions:", error);
      return null;
    }
  }

  private async createAdminSession(
    phoneNumber: string,
    adminLevel: string,
  ): Promise<USSDAdminSession> {
    const session: USSDAdminSession = {
      sessionId: `admin_ussd_${Date.now()}`,
      phoneNumber,
      currentStep: "main_menu",
      adminLevel: adminLevel as "super" | "regional" | "support",
      sessionData: {},
      expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT),
    };

    await this.storeAdminSession(session);
    return session;
  }

  private async handleAdminMainMenu(
    session: USSDAdminSession,
    input: string,
  ): Promise<USSDAdminResponse> {
    if (!input) {
      // Show main menu
      const menu = `SAVANNAH ADMIN (${session.adminLevel.toUpperCase()})
1. View Alerts (${await this.getActiveAlertsCount()})
2. Add Price Cap
3. Check M-Pesa Status
4. System Status
5. Blacklist Supplier
0. Exit

Select:`;

      return {
        message: menu,
        action: "continue",
      };
    }

    switch (input) {
      case "1":
        await this.updateSessionStep(session.sessionId, "view_alerts");
        return this.handleViewAlerts(session, "");

      case "2":
        await this.updateSessionStep(session.sessionId, "price_cap");
        return {
          message:
            "EMERGENCY PRICE CAP\n\nCommon products:\n1. Unga Pembe\n2. Sukari\n3. Mchele\n4. Custom\n\nSelect product:",
          action: "continue",
        };

      case "3":
        return this.handleMPesaStatus(session);

      case "4":
        await this.updateSessionStep(session.sessionId, "system_status");
        return this.handleSystemStatus(session, "");

      case "5":
        if (session.adminLevel === "support") {
          return {
            message:
              "Error: Insufficient permissions for supplier blacklisting.",
            action: "continue",
          };
        }
        await this.updateSessionStep(session.sessionId, "blacklist_supplier");
        return {
          message: "BLACKLIST SUPPLIER\n\nEnter Supplier ID (e.g., SUPP123):",
          action: "continue",
        };

      case "0":
        await this.endAdminSession(session.sessionId);
        return {
          message: "Admin session ended. Asante!",
          action: "end",
        };

      default:
        return {
          message: "Invalid selection. Press 0 to return to main menu.",
          action: "continue",
        };
    }
  }

  private async handleViewAlerts(
    session: USSDAdminSession,
    input: string,
  ): Promise<USSDAdminResponse> {
    try {
      const alerts = await savannaCommandCenter.getAlerts();

      if (alerts.length === 0) {
        return {
          message: "No active alerts.\n\n0. Back to main menu",
          action: "continue",
        };
      }

      let message = `ACTIVE ALERTS (${alerts.length})\n\n`;

      // Show top 3 alerts
      alerts.slice(0, 3).forEach((alert, index) => {
        const icon =
          alert.priority === "lion"
            ? "🦁"
            : alert.priority === "elephant"
              ? "🐘"
              : "🐢";
        message += `${index + 1}. ${icon} ${alert.title}\n`;
        message += `   ${alert.message.substring(0, 40)}...\n`;
        if (alert.county) {
          message += `   County: ${alert.county}\n`;
        }
        message += "\n";
      });

      message += "1. Resolve Alert\n2. Mark as Reviewed\n0. Back\n\nSelect:";

      return {
        message,
        action: "continue",
      };
    } catch (error) {
      return {
        message: "Failed to load alerts.\n0. Back to main menu",
        action: "continue",
      };
    }
  }

  private async handlePriceCap(
    session: USSDAdminSession,
    input: string,
  ): Promise<USSDAdminResponse> {
    const products = ["Unga Pembe", "Sukari", "Mchele", "Custom"];
    const productIndex = parseInt(input) - 1;

    if (productIndex >= 0 && productIndex < products.length) {
      const selectedProduct = products[productIndex];

      await this.updateSessionData(session.sessionId, { selectedProduct });
      await this.updateSessionStep(session.sessionId, "price_cap_amount");

      return {
        message: `PRICE CAP: ${selectedProduct}\n\nCurrent market price: Loading...\n\nEnter maximum price (KSh):`,
        action: "continue",
      };
    }

    return {
      message:
        "Invalid product selection.\n\n1. Unga Pembe\n2. Sukari\n3. Mchele\n4. Custom\n\nSelect:",
      action: "continue",
    };
  }

  private async handlePriceCapAmount(
    session: USSDAdminSession,
    input: string,
  ): Promise<USSDAdminResponse> {
    const maxPrice = parseFloat(input);

    if (isNaN(maxPrice) || maxPrice <= 0) {
      return {
        message: "Invalid price. Enter amount in KSh (e.g., 150):",
        action: "continue",
      };
    }

    if (maxPrice > 10000) {
      return {
        message: "Price too high. Maximum allowed: 10,000 KSh. Re-enter:",
        action: "continue",
      };
    }

    try {
      const product = session.sessionData.selectedProduct;

      // Execute emergency price cap
      await savannaCommandCenter.executeEmergencyPriceCap(product, maxPrice);

      // Log admin action
      await this.logAdminAction(session.phoneNumber, "price_cap", {
        product,
        maxPrice,
        method: "ussd",
      });

      await this.updateSessionStep(session.sessionId, "main_menu");

      return {
        message: `✅ PRICE CAP ACTIVATED\n\nProduct: ${product}\nMax Price: ${maxPrice} KSh\n\nSMS alerts sent to suppliers.\n\n0. Back to main menu`,
        action: "continue",
      };
    } catch (error) {
      return {
        message:
          "Failed to activate price cap. Try again.\n\n0. Back to main menu",
        action: "continue",
      };
    }
  }

  private async handleBlacklistSupplier(
    session: USSDAdminSession,
    input: string,
  ): Promise<USSDAdminResponse> {
    if (!input || input.length < 3) {
      return {
        message: "Invalid Supplier ID. Format: SUPP123\n\nEnter Supplier ID:",
        action: "continue",
      };
    }

    // Validate supplier exists
    const { data: supplier, error } = await supabase
      .from("suppliers")
      .select("id, business_name, status")
      .eq("id", input.toUpperCase())
      .single();

    if (error || !supplier) {
      return {
        message: `Supplier ${input} not found.\n\nEnter valid Supplier ID:`,
        action: "continue",
      };
    }

    if (supplier.status === "blacklisted") {
      return {
        message: `Supplier ${input} already blacklisted.\n\n0. Back to main menu`,
        action: "continue",
      };
    }

    await this.updateSessionData(session.sessionId, {
      supplierId: input.toUpperCase(),
      supplierName: supplier.business_name,
    });
    await this.updateSessionStep(session.sessionId, "blacklist_reason");

    return {
      message: `BLACKLIST: ${supplier.business_name}\n\nReason codes:\n1. Fraud detected\n2. Fake products\n3. Price manipulation\n4. Policy violation\n5. Custom reason\n\nSelect:`,
      action: "continue",
    };
  }

  private async handleBlacklistReason(
    session: USSDAdminSession,
    input: string,
  ): Promise<USSDAdminResponse> {
    const reasons = [
      "Fraud detected",
      "Fake products",
      "Price manipulation",
      "Policy violation",
      "Custom reason",
    ];

    const reasonIndex = parseInt(input) - 1;

    if (reasonIndex >= 0 && reasonIndex < reasons.length) {
      const reason = reasons[reasonIndex];

      try {
        await savannaCommandCenter.blacklistSupplier(
          session.sessionData.supplierId,
          reason,
        );

        // Log admin action
        await this.logAdminAction(session.phoneNumber, "blacklist_supplier", {
          supplierId: session.sessionData.supplierId,
          supplierName: session.sessionData.supplierName,
          reason,
          method: "ussd",
        });

        await this.updateSessionStep(session.sessionId, "main_menu");

        return {
          message: `✅ SUPPLIER BLACKLISTED\n\nSupplier: ${session.sessionData.supplierName}\nReason: ${reason}\n\nAll products delisted.\n\n0. Back to main menu`,
          action: "continue",
        };
      } catch (error) {
        return {
          message: "Failed to blacklist supplier.\n\n0. Back to main menu",
          action: "continue",
        };
      }
    }

    return {
      message:
        "Invalid reason code.\n\n1. Fraud\n2. Fake products\n3. Price manipulation\n4. Policy violation\n5. Custom\n\nSelect:",
      action: "continue",
    };
  }

  private async handleSystemStatus(
    session: USSDAdminSession,
    input: string,
  ): Promise<USSDAdminResponse> {
    try {
      // Get system health metrics
      const healthData = await this.getSystemHealth();

      let message = "SYSTEM STATUS\n\n";
      message += `Database: ${healthData.database ? "✅" : "❌"}\n`;
      message += `M-Pesa API: ${healthData.mpesa ? "✅" : "❌"}\n`;
      message += `USSD Gateway: ${healthData.ussd ? "✅" : "❌"}\n`;
      message += `SMS Service: ${healthData.sms ? "✅" : "❌"}\n\n`;

      message += `Active Users: ${healthData.activeUsers}\n`;
      message += `Orders Today: ${healthData.ordersToday}\n`;
      message += `Revenue Today: ${healthData.revenueToday}\n\n`;

      message += "1. Detailed Report\n2. Restart Service\n0. Back\n\nSelect:";

      return {
        message,
        action: "continue",
      };
    } catch (error) {
      return {
        message: "System status unavailable.\n\n0. Back to main menu",
        action: "continue",
      };
    }
  }

  private async handleMPesaStatus(
    session: USSDAdminSession,
  ): Promise<USSDAdminResponse> {
    try {
      const mpesaHealth = await this.checkMPesaHealth();

      let message = "M-PESA STATUS\n\n";
      message += `API Status: ${mpesaHealth.apiStatus}\n`;
      message += `Success Rate: ${mpesaHealth.successRate}%\n`;
      message += `Failed Today: ${mpesaHealth.failedToday}\n`;
      message += `Avg Response: ${mpesaHealth.avgResponseTime}ms\n\n`;

      if (mpesaHealth.successRate < 95) {
        message += "⚠️ WARNING: Low success rate\n";
      }

      if (mpesaHealth.failedToday > 50) {
        message += "🚨 HIGH: Many failures today\n";
      }

      message += "\n0. Back to main menu";

      return {
        message,
        action: "continue",
      };
    } catch (error) {
      return {
        message: "M-Pesa status unavailable.\n\n0. Back to main menu",
        action: "continue",
      };
    }
  }

  // Helper methods
  private async getActiveAlertsCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from("admin_alerts")
        .select("id")
        .eq("resolved", false);

      return data?.length || 0;
    } catch (error) {
      return 0;
    }
  }

  private async getSystemHealth(): Promise<any> {
    // Mock system health data - in production, integrate with monitoring systems
    return {
      database: true,
      mpesa: true,
      ussd: true,
      sms: true,
      activeUsers: 1247,
      ordersToday: 156,
      revenueToday: "KES 245K",
    };
  }

  private async checkMPesaHealth(): Promise<any> {
    // Mock M-Pesa health data - in production, query actual M-Pesa API metrics
    return {
      apiStatus: "Online",
      successRate: 98.2,
      failedToday: 23,
      avgResponseTime: 1.8,
    };
  }

  private async storeAdminSession(session: USSDAdminSession): Promise<void> {
    await supabase.from("ussd_admin_sessions").upsert({
      session_id: session.sessionId,
      phone_number: session.phoneNumber,
      current_step: session.currentStep,
      admin_level: session.adminLevel,
      session_data: session.sessionData,
      expires_at: session.expiresAt.toISOString(),
    });
  }

  private async getAdminSession(
    sessionId: string,
  ): Promise<USSDAdminSession | null> {
    const { data, error } = await supabase
      .from("ussd_admin_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error || !data) return null;

    return {
      sessionId: data.session_id,
      phoneNumber: data.phone_number,
      currentStep: data.current_step,
      adminLevel: data.admin_level,
      sessionData: data.session_data || {},
      expiresAt: new Date(data.expires_at),
    };
  }

  private async updateSessionStep(
    sessionId: string,
    step: string,
  ): Promise<void> {
    await supabase
      .from("ussd_admin_sessions")
      .update({
        current_step: step,
        expires_at: new Date(Date.now() + this.SESSION_TIMEOUT).toISOString(),
      })
      .eq("session_id", sessionId);
  }

  private async updateSessionData(
    sessionId: string,
    data: Record<string, any>,
  ): Promise<void> {
    const session = await this.getAdminSession(sessionId);
    if (session) {
      const updatedData = { ...session.sessionData, ...data };
      await supabase
        .from("ussd_admin_sessions")
        .update({
          session_data: updatedData,
          expires_at: new Date(Date.now() + this.SESSION_TIMEOUT).toISOString(),
        })
        .eq("session_id", sessionId);
    }
  }

  private async endAdminSession(sessionId: string): Promise<void> {
    await supabase
      .from("ussd_admin_sessions")
      .delete()
      .eq("session_id", sessionId);
  }

  private isSessionExpired(session: USSDAdminSession): boolean {
    return new Date() > session.expiresAt;
  }

  private async logAdminAction(
    adminPhone: string,
    action: string,
    details: any,
  ): Promise<void> {
    await supabase.from("admin_action_logs").insert({
      admin_phone: adminPhone,
      action_type: action,
      action_details: details,
      timestamp: new Date().toISOString(),
      method: "ussd",
    });
  }
}

export const ussdAdminService = new USSDAdminService();
