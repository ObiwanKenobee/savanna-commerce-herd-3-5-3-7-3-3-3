import axios from "axios";
import { config } from "../config/environment";
import { logger, logPerformance } from "../utils/logger";
import { normalizePhoneNumber, validatePhoneNumber } from "../utils/otp";
import db from "../config/database";

interface SMSRequest {
  to: string;
  message: string;
  from?: string;
  priority?: "low" | "normal" | "high";
  deliveryReport?: boolean;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  cost?: string;
  status?: string;
  error?: string;
}

class SMSService {
  private apiKey: string;
  private username: string;
  private senderId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.sms.apiKey;
    this.username = config.sms.username;
    this.senderId = config.sms.provider;
    this.baseUrl = config.app.env === "production" 
      ? "https://api.africastalking.com/version1/messaging" 
      : "https://api.sandbox.africastalking.com/version1/messaging";
  }

  // Send SMS using Africa's Talking API
  async sendSMS(request: SMSRequest): Promise<SMSResponse> {
    const startTime = Date.now();

    try {
      // Validate phone number
      if (!validatePhoneNumber(request.to)) {
        throw new Error(`Invalid phone number format: ${request.to}`);
      }

      // Normalize phone number
      const normalizedPhone = normalizePhoneNumber(request.to);

      // Check if SMS is enabled
      if (!this.apiKey) {
        logger.info("SMS service disabled, logging message:", {
          to: normalizedPhone.replace(/\d{4}$/, "****"),
          message: request.message.substring(0, 50) + "...",
        });
        return { success: true, messageId: "SMS_DISABLED_" + Date.now() };
      }

      // Prepare SMS data
      const smsData = {
        username: this.username,
        to: normalizedPhone,
        message: request.message,
        from: request.from || this.senderId,
        bulkSMSMode: 0, // Single SMS
        deliveryReports: request.deliveryReport ? 1 : 0,
      };

      // Send SMS via Africa's Talking API
      const response = await axios.post(
        `${this.baseUrl}/messaging`,
        new URLSearchParams(smsData as any).toString(),
        {
          headers: {
            apikey: this.apiKey,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        },
      );

      const responseData = response.data;
      const duration = Date.now() - startTime;

      // Log performance
      logPerformance("sms_send", duration, response.status === 200);

      // Process response
      if (
        responseData.SMSMessageData &&
        responseData.SMSMessageData.Recipients
      ) {
        const recipient = responseData.SMSMessageData.Recipients[0];

        if (recipient.status === "Success") {
          // Log successful SMS
          await this.logSMSNotification(
            normalizedPhone,
            request.message,
            "sent",
            recipient.messageId,
            recipient.cost,
          );

          logger.info("SMS sent successfully", {
            to: normalizedPhone.replace(/\d{4}$/, "****"),
            messageId: recipient.messageId,
            cost: recipient.cost,
            duration,
          });

          return {
            success: true,
            messageId: recipient.messageId,
            cost: recipient.cost,
            status: "sent",
          };
        } else {
          throw new Error(`SMS failed: ${recipient.status}`);
        }
      } else {
        throw new Error("Invalid response format from SMS gateway");
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      // Log error
      logger.error("SMS sending failed:", {
        error: error.message,
        to: request.to.replace(/\d{4}$/, "****"),
        duration,
      });

      // Log failed SMS
      await this.logSMSNotification(
        normalizePhoneNumber(request.to),
        request.message,
        "failed",
        undefined,
        undefined,
        error.message,
      );

      logPerformance("sms_send", duration, false);

      return {
        success: false,
        error: error.message,
        status: "failed",
      };
    }
  }

  // Send OTP SMS
  async sendOTP(
    phoneNumber: string,
    code: string,
    purpose: string = "verification",
  ): Promise<SMSResponse> {
    const message = this.generateOTPMessage(code, purpose);

    return await this.sendSMS({
      to: phoneNumber,
      message,
      priority: "high",
      deliveryReport: true,
    });
  }

  // Send conservation update SMS
  async sendConservationUpdate(
    phoneNumber: string,
    update: {
      habitatProtected?: number;
      animalsSupported?: number;
      carbonOffset?: number;
      projectName?: string;
    },
  ): Promise<SMSResponse> {
    const message = this.generateConservationMessage(update);

    return await this.sendSMS({
      to: phoneNumber,
      message,
      priority: "normal",
    });
  }

  // Send wildlife alert SMS
  async sendWildlifeAlert(
    phoneNumbers: string[],
    alert: {
      animalName: string;
      location: string;
      alertType: "sighting" | "emergency" | "movement" | "health";
      description: string;
    },
  ): Promise<SMSResponse[]> {
    const message = this.generateWildlifeAlertMessage(alert);

    const results = await Promise.all(
      phoneNumbers.map((phoneNumber) =>
        this.sendSMS({
          to: phoneNumber,
          message,
          priority: "high",
        }),
      ),
    );

    return results;
  }

  // Send payment notification SMS
  async sendPaymentNotification(
    phoneNumber: string,
    payment: {
      amount: number;
      currency: string;
      type: "received" | "sent" | "failed";
      description: string;
      transactionId?: string;
    },
  ): Promise<SMSResponse> {
    const message = this.generatePaymentMessage(payment);

    return await this.sendSMS({
      to: phoneNumber,
      message,
      priority: "high",
      deliveryReport: true,
    });
  }

  // Send bulk SMS to multiple recipients
  async sendBulkSMS(
    recipients: string[],
    message: string,
  ): Promise<SMSResponse[]> {
    // Process in batches to avoid overwhelming the API
    const batchSize = 50;
    const results: SMSResponse[] = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map((phoneNumber) =>
          this.sendSMS({
            to: phoneNumber,
            message,
            priority: "normal",
          }),
        ),
      );

      results.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    return results;
  }

  // Generate OTP message
  private generateOTPMessage(code: string, purpose: string): string {
    switch (purpose) {
      case "authentication":
        return `Your Savannah login code: ${code}. Valid for 5 minutes. Keep it secret! 🦁`;

      case "verification":
        return `Verify your phone with Savannah: ${code}. Code expires in 10 minutes. 🌍`;

      case "password_reset":
        return `Reset your Savannah password with code: ${code}. Valid for 15 minutes. If you didn't request this, ignore. 🔒`;

      default:
        return `Your Savannah verification code: ${code}. Valid for 5 minutes. 🦁`;
    }
  }

  // Generate conservation update message
  private generateConservationMessage(update: {
    habitatProtected?: number;
    animalsSupported?: number;
    carbonOffset?: number;
    projectName?: string;
  }): string {
    let message = "🦁 CONSERVATION UPDATE!\n\n";

    if (update.habitatProtected) {
      message += `🌍 ${update.habitatProtected}m² habitat protected\n`;
    }

    if (update.animalsSupported) {
      message += `🐘 ${update.animalsSupported} animals supported\n`;
    }

    if (update.carbonOffset) {
      message += `🌳 ${update.carbonOffset}kg CO² offset\n`;
    }

    if (update.projectName) {
      message += `📍 Project: ${update.projectName}\n`;
    }

    message += "\nTrack impact: *384*WILD#\nThank you for caring! 🙏";

    return message;
  }

  // Generate wildlife alert message
  private generateWildlifeAlertMessage(alert: {
    animalName: string;
    location: string;
    alertType: string;
    description: string;
  }): string {
    const emoji =
      alert.alertType === "emergency"
        ? "🚨"
        : alert.alertType === "sighting"
          ? "👀"
          : alert.alertType === "movement"
            ? "📍"
            : "💚";

    return (
      `${emoji} WILDLIFE ALERT\n\n` +
      `🐾 Animal: ${alert.animalName}\n` +
      `📍 Location: ${alert.location}\n` +
      `ℹ️ ${alert.description}\n\n` +
      `Stay safe and keep distance.\n` +
      `Report: *384*WILD#`
    );
  }

  // Generate payment message
  private generatePaymentMessage(payment: {
    amount: number;
    currency: string;
    type: string;
    description: string;
    transactionId?: string;
  }): string {
    const emoji =
      payment.type === "received"
        ? "💰"
        : payment.type === "sent"
          ? "💸"
          : "❌";

    let message = `${emoji} PAYMENT ${payment.type.toUpperCase()}\n\n`;
    message += `💵 Amount: ${payment.currency} ${payment.amount.toFixed(2)}\n`;
    message += `📝 ${payment.description}\n`;

    if (payment.transactionId) {
      message += `🔖 ID: ${payment.transactionId}\n`;
    }

    message += `\nSavannah Ecosystem 🌍`;

    return message;
  }

  // Log SMS notification to database
  private async logSMSNotification(
    phoneNumber: string,
    message: string,
    status: "pending" | "sent" | "delivered" | "failed",
    messageId?: string,
    cost?: string,
    errorMessage?: string,
  ): Promise<void> {
    try {
      await db.query(
        `
        INSERT INTO notifications (
          type, message, channel_data, status, 
          sent_at, error_message
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          "sms",
          message,
          JSON.stringify({
            phoneNumber: phoneNumber.replace(/\d{4}$/, "****"), // Mask phone number
            messageId,
            cost,
          }),
          status,
          status === "sent" || status === "delivered" ? new Date() : null,
          errorMessage,
        ],
      );
    } catch (error) {
      logger.error("Failed to log SMS notification:", error);
    }
  }

  // Check SMS delivery status
  async checkDeliveryStatus(messageId: string): Promise<{
    status: string;
    deliveredAt?: Date;
    failureReason?: string;
  }> {
    try {
      // Note: This would typically call the SMS provider's status API
      // For now, we'll check our local notifications table
      const result = await db.query(
        `
        SELECT status, delivered_at, error_message
        FROM notifications
        WHERE channel_data->>'messageId' = $1 AND type = 'sms'
        ORDER BY created_at DESC
        LIMIT 1
      `,
        [messageId],
      );

      if (result.rows.length > 0) {
        const notification = result.rows[0];
        return {
          status: notification.status,
          deliveredAt: notification.delivered_at,
          failureReason: notification.error_message,
        };
      }

      return { status: "unknown" };
    } catch (error) {
      logger.error("Failed to check SMS delivery status:", error);
      return { status: "error", failureReason: error.message };
    }
  }

  // Get SMS statistics
  async getSMSStats(
    timeframe: "hour" | "day" | "week" | "month" = "day",
  ): Promise<{
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
    totalCost: number;
  }> {
    try {
      const timeCondition = this.getTimeCondition(timeframe);

      const result = await db.query(`
        SELECT 
          status,
          COUNT(*) as count,
          SUM(CAST(channel_data->>'cost' AS DECIMAL)) as total_cost
        FROM notifications
        WHERE type = 'sms' AND created_at > ${timeCondition}
        GROUP BY status
      `);

      const stats = {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
        totalCost: 0,
      };

      result.rows.forEach((row) => {
        const count = parseInt(row.count);
        const cost = parseFloat(row.total_cost || 0);

        stats[row.status] = count;
        stats.totalCost += cost;
      });

      return stats;
    } catch (error) {
      logger.error("Failed to get SMS statistics:", error);
      return {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
        totalCost: 0,
      };
    }
  }

  private getTimeCondition(timeframe: string): string {
    switch (timeframe) {
      case "hour":
        return "NOW() - INTERVAL '1 hour'";
      case "day":
        return "NOW() - INTERVAL '1 day'";
      case "week":
        return "NOW() - INTERVAL '1 week'";
      case "month":
        return "NOW() - INTERVAL '1 month'";
      default:
        return "NOW() - INTERVAL '1 day'";
    }
  }
}

// Create singleton instance
export const smsService = new SMSService();

// Export convenience functions
export const sendSMS = async (
  phoneNumber: string,
  message: string,
): Promise<boolean> => {
  const result = await smsService.sendSMS({
    to: phoneNumber,
    message,
  });
  return result.success;
};

export const sendOTP = async (
  phoneNumber: string,
  code: string,
  purpose?: string,
): Promise<boolean> => {
  const result = await smsService.sendOTP(phoneNumber, code, purpose);
  return result.success;
};

export const sendConservationUpdate = async (
  phoneNumber: string,
  update: Parameters<typeof smsService.sendConservationUpdate>[1],
): Promise<boolean> => {
  const result = await smsService.sendConservationUpdate(phoneNumber, update);
  return result.success;
};

export default smsService;
