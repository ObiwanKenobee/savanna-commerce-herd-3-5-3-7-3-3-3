import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

interface MpesaTransaction {
  merchantRequestID: string;
  checkoutRequestID: string;
  resultCode: number;
  resultDesc: string;
  amount: number;
  mpesaReceiptNumber?: string;
  balance?: string;
  transactionDate?: string;
  phoneNumber: string;
  orderId?: string;
}

interface STKPushRequest {
  businessShortCode: string;
  password: string;
  timestamp: string;
  transactionType: string;
  amount: number;
  partyA: string; // Phone number
  partyB: string; // Business short code
  phoneNumber: string;
  callBackURL: string;
  accountReference: string; // Order ID
  transactionDesc: string;
}

interface ReconciliationResult {
  orderId: string;
  status: "matched" | "pending" | "failed" | "duplicate";
  mpesaCode?: string;
  amount: number;
  discrepancy?: number;
  reconciled: boolean;
  timestamp: string;
}

class MpesaService {
  private static instance: MpesaService;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  static getInstance(): MpesaService {
    if (!MpesaService.instance) {
      MpesaService.instance = new MpesaService();
    }
    return MpesaService.instance;
  }

  // Get OAuth access token from Safaricom
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = btoa(
        `${process.env.VITE_MPESA_CONSUMER_KEY}:${process.env.VITE_MPESA_CONSUMER_SECRET}`,
      );

      const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error("Failed to get M-Pesa access token:", error);
      throw new Error("M-Pesa authentication failed");
    }
  }

  // Initiate STK Push for payment
  async initiateSTKPush(
    phoneNumber: string,
    amount: number,
    orderId: string,
    description: string = "Savanna Marketplace Payment",
  ): Promise<{
    success: boolean;
    checkoutRequestID?: string;
    merchantRequestID?: string;
    error?: string;
  }> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
      const password = btoa(
        `${process.env.VITE_MPESA_SHORTCODE}${process.env.VITE_MPESA_PASSKEY}${timestamp}`,
      );

      const stkRequest: STKPushRequest = {
        businessShortCode: process.env.VITE_MPESA_SHORTCODE || "174379",
        password,
        timestamp,
        transactionType: "CustomerPayBillOnline",
        amount,
        partyA: phoneNumber,
        partyB: process.env.VITE_MPESA_SHORTCODE || "174379",
        phoneNumber,
        callBackURL: `${process.env.VITE_APP_URL}/api/mpesa/callback`,
        accountReference: orderId,
        transactionDesc: description,
      };

      const response = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        stkRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.ResponseCode === "0") {
        // Store pending transaction
        await this.storePendingTransaction({
          merchantRequestID: response.data.MerchantRequestID,
          checkoutRequestID: response.data.CheckoutRequestID,
          orderId,
          phoneNumber,
          amount,
          status: "pending",
          initiated_at: new Date().toISOString(),
        });

        return {
          success: true,
          checkoutRequestID: response.data.CheckoutRequestID,
          merchantRequestID: response.data.MerchantRequestID,
        };
      } else {
        return {
          success: false,
          error: response.data.ResponseDescription,
        };
      }
    } catch (error: any) {
      console.error("STK Push failed:", error);
      return {
        success: false,
        error:
          error.response?.data?.errorMessage || "Payment initiation failed",
      };
    }
  }

  // Handle M-Pesa callback from Safaricom
  async handleCallback(
    callbackData: any,
  ): Promise<ReconciliationResult | null> {
    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;

      const transaction: MpesaTransaction = {
        merchantRequestID: stkCallback.MerchantRequestID,
        checkoutRequestID: stkCallback.CheckoutRequestID,
        resultCode: stkCallback.ResultCode,
        resultDesc: stkCallback.ResultDesc,
        amount: 0,
        phoneNumber: "",
      };

      // Extract transaction details if successful
      if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata) {
        const metadata = stkCallback.CallbackMetadata.Item;

        metadata.forEach((item: any) => {
          switch (item.Name) {
            case "Amount":
              transaction.amount = item.Value;
              break;
            case "MpesaReceiptNumber":
              transaction.mpesaReceiptNumber = item.Value;
              break;
            case "Balance":
              transaction.balance = item.Value;
              break;
            case "TransactionDate":
              transaction.transactionDate = item.Value;
              break;
            case "PhoneNumber":
              transaction.phoneNumber = item.Value;
              break;
          }
        });
      }

      // Auto-reconcile with order
      return await this.autoReconcileTransaction(transaction);
    } catch (error) {
      console.error("M-Pesa callback handling failed:", error);
      return null;
    }
  }

  // Auto-reconciliation: Match M-Pesa payments to orders
  private async autoReconcileTransaction(
    transaction: MpesaTransaction,
  ): Promise<ReconciliationResult> {
    try {
      // Find pending transaction
      const { data: pendingTx, error: fetchError } = await supabase
        .from("mpesa_transactions")
        .select("*, order_id")
        .eq("checkout_request_id", transaction.checkoutRequestID)
        .single();

      if (fetchError || !pendingTx) {
        console.error("Pending transaction not found:", fetchError);
        return {
          orderId: "unknown",
          status: "failed",
          amount: transaction.amount,
          reconciled: false,
          timestamp: new Date().toISOString(),
        };
      }

      const orderId = pendingTx.order_id;

      // Get order details
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("total_amount, status")
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        return {
          orderId,
          status: "failed",
          amount: transaction.amount,
          reconciled: false,
          timestamp: new Date().toISOString(),
        };
      }

      let reconciliationStatus: "matched" | "pending" | "failed" = "failed";
      let discrepancy = 0;

      if (transaction.resultCode === 0) {
        // Payment successful - check amount match
        discrepancy = Math.abs(transaction.amount - order.total_amount);

        if (discrepancy <= 1) {
          // Allow KSH 1 tolerance for rounding
          reconciliationStatus = "matched";

          // Update order status
          await supabase
            .from("orders")
            .update({
              status: "paid",
              payment_method: "mpesa",
              payment_reference: transaction.mpesaReceiptNumber,
              paid_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          // Update M-Pesa transaction record
          await supabase
            .from("mpesa_transactions")
            .update({
              result_code: transaction.resultCode,
              result_desc: transaction.resultDesc,
              amount: transaction.amount,
              mpesa_receipt: transaction.mpesaReceiptNumber,
              transaction_date: transaction.transactionDate,
              status: "completed",
              reconciled: true,
              completed_at: new Date().toISOString(),
            })
            .eq("checkout_request_id", transaction.checkoutRequestID);

          // Trigger order fulfillment workflow
          await this.triggerOrderFulfillment(orderId);
        } else {
          reconciliationStatus = "pending";
          // Flag for manual reconciliation
          await this.flagForManualReconciliation(
            orderId,
            transaction,
            discrepancy,
          );
        }
      } else {
        // Payment failed
        await supabase
          .from("mpesa_transactions")
          .update({
            result_code: transaction.resultCode,
            result_desc: transaction.resultDesc,
            status: "failed",
            failed_at: new Date().toISOString(),
          })
          .eq("checkout_request_id", transaction.checkoutRequestID);

        // Update order status
        await supabase
          .from("orders")
          .update({ status: "payment_failed" })
          .eq("id", orderId);
      }

      return {
        orderId,
        status: reconciliationStatus,
        mpesaCode: transaction.mpesaReceiptNumber,
        amount: transaction.amount,
        discrepancy: discrepancy > 0 ? discrepancy : undefined,
        reconciled: reconciliationStatus === "matched",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Auto-reconciliation failed:", error);
      return {
        orderId: transaction.orderId || "unknown",
        status: "failed",
        amount: transaction.amount,
        reconciled: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Store pending transaction
  private async storePendingTransaction(data: any) {
    const { error } = await supabase.from("mpesa_transactions").insert({
      merchant_request_id: data.merchantRequestID,
      checkout_request_id: data.checkoutRequestID,
      order_id: data.orderId,
      phone_number: data.phoneNumber,
      amount: data.amount,
      status: data.status,
      initiated_at: data.initiated_at,
    });

    if (error) {
      console.error("Failed to store pending transaction:", error);
    }
  }

  // Flag transaction for manual reconciliation
  private async flagForManualReconciliation(
    orderId: string,
    transaction: MpesaTransaction,
    discrepancy: number,
  ) {
    await supabase.from("reconciliation_flags").insert({
      order_id: orderId,
      mpesa_receipt: transaction.mpesaReceiptNumber,
      expected_amount: 0, // Will be filled from order
      actual_amount: transaction.amount,
      discrepancy,
      status: "pending_review",
      flagged_at: new Date().toISOString(),
    });

    // Send alert to finance team
    console.log(
      `💰 Manual reconciliation required for order ${orderId}, discrepancy: KSH ${discrepancy}`,
    );
  }

  // Trigger order fulfillment after successful payment
  private async triggerOrderFulfillment(orderId: string) {
    try {
      // Create fulfillment record
      await supabase.from("order_fulfillments").insert({
        order_id: orderId,
        status: "processing",
        created_at: new Date().toISOString(),
      });

      // Trigger inventory updates
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      if (orderItems) {
        for (const item of orderItems) {
          // Reduce inventory
          await supabase.rpc("reduce_inventory", {
            product_id: item.product_id,
            quantity: item.quantity,
          });
        }
      }

      // Send notifications
      console.log(`📦 Order fulfillment triggered for ${orderId}`);
    } catch (error) {
      console.error("Order fulfillment trigger failed:", error);
    }
  }

  // Query transaction status
  async queryTransactionStatus(checkoutRequestID: string) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
      const password = btoa(
        `${process.env.VITE_MPESA_SHORTCODE}${process.env.VITE_MPESA_PASSKEY}${timestamp}`,
      );

      const response = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
        {
          businessShortCode: process.env.VITE_MPESA_SHORTCODE,
          password,
          timestamp,
          checkoutRequestID,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error("Transaction query failed:", error);
      return null;
    }
  }

  // Manual reconciliation for finance team
  async manualReconciliation(
    orderId: string,
    mpesaCode: string,
    amount: number,
    approved: boolean,
    notes?: string,
  ): Promise<boolean> {
    try {
      if (approved) {
        // Approve the transaction
        await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_method: "mpesa",
            payment_reference: mpesaCode,
            paid_at: new Date().toISOString(),
            manual_reconciliation: true,
            reconciliation_notes: notes,
          })
          .eq("id", orderId);

        // Update reconciliation flag
        await supabase
          .from("reconciliation_flags")
          .update({
            status: "approved",
            reviewed_at: new Date().toISOString(),
            reviewer_notes: notes,
          })
          .eq("order_id", orderId);

        // Trigger fulfillment
        await this.triggerOrderFulfillment(orderId);
      } else {
        // Reject the transaction
        await supabase
          .from("reconciliation_flags")
          .update({
            status: "rejected",
            reviewed_at: new Date().toISOString(),
            reviewer_notes: notes,
          })
          .eq("order_id", orderId);
      }

      return true;
    } catch (error) {
      console.error("Manual reconciliation failed:", error);
      return false;
    }
  }

  // Get reconciliation dashboard data
  async getReconciliationStats(dateRange: { from: string; to: string }) {
    try {
      const { data, error } = await supabase
        .from("mpesa_transactions")
        .select("*")
        .gte("initiated_at", dateRange.from)
        .lte("initiated_at", dateRange.to);

      if (error) throw error;

      const stats = {
        totalTransactions: data.length,
        successfulPayments: data.filter((t) => t.status === "completed").length,
        failedPayments: data.filter((t) => t.status === "failed").length,
        pendingReconciliation: data.filter((t) => t.reconciled === false)
          .length,
        totalAmount: data.reduce((sum, t) => sum + (t.amount || 0), 0),
        reconciliationRate: 0,
      };

      stats.reconciliationRate =
        stats.totalTransactions > 0
          ? (stats.successfulPayments / stats.totalTransactions) * 100
          : 0;

      return stats;
    } catch (error) {
      console.error("Failed to get reconciliation stats:", error);
      return null;
    }
  }
}

export const mpesaService = MpesaService.getInstance();
export type { MpesaTransaction, ReconciliationResult, STKPushRequest };
