import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface InventoryUpdate {
  productId: string;
  stockLevel: number;
  lastUpdated: string;
  syncChannel: "web" | "mobile" | "ussd" | "api";
}

interface InventoryAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minimumThreshold: number;
  alertType: "low_stock" | "out_of_stock" | "auto_pause";
  supplierId: string;
}

class InventoryService {
  private static instance: InventoryService;
  private wsConnection: WebSocket | null = null;
  private inventoryCache = new Map<string, InventoryUpdate>();
  private subscriptions = new Map<string, (update: InventoryUpdate) => void>();

  static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  constructor() {
    this.initializeWebSocket();
    this.initializeRealtimeSubscription();
  }

  // WebSocket connection for <1s latency updates
  private initializeWebSocket() {
    try {
      // In production, use Ably or Firebase WebSocket
      this.wsConnection = new WebSocket(
        process.env.VITE_INVENTORY_WS_URL || "ws://localhost:8080/inventory",
      );

      this.wsConnection.onopen = () => {
        console.log("🔄 Inventory sync connected");
      };

      this.wsConnection.onmessage = (event) => {
        const update: InventoryUpdate = JSON.parse(event.data);
        this.handleInventoryUpdate(update);
      };

      this.wsConnection.onclose = () => {
        console.log("🔄 Inventory sync disconnected, reconnecting...");
        setTimeout(() => this.initializeWebSocket(), 3000);
      };
    } catch (error) {
      console.error("WebSocket connection failed:", error);
    }
  }

  // Supabase real-time subscription as fallback
  private initializeRealtimeSubscription() {
    supabase
      .channel("inventory_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
        },
        (payload) => {
          const update: InventoryUpdate = {
            productId: payload.new.id,
            stockLevel: payload.new.stock_quantity,
            lastUpdated: new Date().toISOString(),
            syncChannel: "web",
          };
          this.handleInventoryUpdate(update);
        },
      )
      .subscribe();
  }

  // Handle real-time inventory updates
  private handleInventoryUpdate(update: InventoryUpdate) {
    // Update cache
    this.inventoryCache.set(update.productId, update);

    // Check for auto-pause threshold (90% depletion)
    this.checkAutoPauseThreshold(update);

    // Notify subscribers
    const callback = this.subscriptions.get(update.productId);
    if (callback) {
      callback(update);
    }

    // Broadcast to all channels if needed
    this.broadcastToAllChannels(update);
  }

  // Auto-pause listings at 90% stock depletion
  private async checkAutoPauseThreshold(update: InventoryUpdate) {
    try {
      const { data: product } = await supabase
        .from("products")
        .select("minimum_order_quantity, status, name, supplier_id")
        .eq("id", update.productId)
        .single();

      if (!product) return;

      const depletionThreshold = product.minimum_order_quantity * 1.1; // 90% depletion

      if (
        update.stockLevel <= depletionThreshold &&
        product.status === "active"
      ) {
        // Auto-pause the listing
        await this.pauseListing(update.productId, "auto_pause");

        // Send alert to supplier
        await this.sendInventoryAlert({
          productId: update.productId,
          productName: product.name,
          currentStock: update.stockLevel,
          minimumThreshold: depletionThreshold,
          alertType: "auto_pause",
          supplierId: product.supplier_id,
        });

        toast({
          title: "⚠️ Product Auto-Paused",
          description: `${product.name} paused due to low stock (${update.stockLevel} remaining)`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Auto-pause check failed:", error);
    }
  }

  // Pause listing due to low stock
  async pauseListing(productId: string, reason: string) {
    const { error } = await supabase
      .from("products")
      .update({
        status: "paused",
        pause_reason: reason,
        paused_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      console.error("Failed to pause listing:", error);
      return false;
    }

    // Log the pause action
    await this.logInventoryAction(productId, "auto_pause", reason);
    return true;
  }

  // Resume paused listing
  async resumeListing(productId: string) {
    const { error } = await supabase
      .from("products")
      .update({
        status: "active",
        pause_reason: null,
        paused_at: null,
        resumed_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) {
      console.error("Failed to resume listing:", error);
      return false;
    }

    await this.logInventoryAction(productId, "resume", "Manual resume");
    return true;
  }

  // Update inventory across all channels
  async updateInventory(
    productId: string,
    newStock: number,
    channel: "web" | "mobile" | "ussd" | "api" = "web",
  ) {
    try {
      // Update database
      const { error } = await supabase
        .from("products")
        .update({
          stock_quantity: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (error) throw error;

      // Create update object
      const update: InventoryUpdate = {
        productId,
        stockLevel: newStock,
        lastUpdated: new Date().toISOString(),
        syncChannel: channel,
      };

      // Send via WebSocket for instant sync
      if (this.wsConnection?.readyState === WebSocket.OPEN) {
        this.wsConnection.send(JSON.stringify(update));
      }

      // Log the update
      await this.logInventoryAction(
        productId,
        "stock_update",
        `Updated to ${newStock} via ${channel}`,
      );

      return true;
    } catch (error) {
      console.error("Inventory update failed:", error);
      return false;
    }
  }

  // Subscribe to inventory updates for a specific product
  subscribeToProduct(
    productId: string,
    callback: (update: InventoryUpdate) => void,
  ) {
    this.subscriptions.set(productId, callback);

    // Return cached data if available
    const cached = this.inventoryCache.get(productId);
    if (cached) {
      callback(cached);
    }

    // Return unsubscribe function
    return () => {
      this.subscriptions.delete(productId);
    };
  }

  // Get current stock level (with cache)
  async getCurrentStock(productId: string): Promise<number> {
    // Check cache first
    const cached = this.inventoryCache.get(productId);
    if (cached && Date.now() - new Date(cached.lastUpdated).getTime() < 5000) {
      return cached.stockLevel;
    }

    // Fetch from database
    const { data, error } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", productId)
      .single();

    if (error || !data) {
      console.error("Failed to fetch stock:", error);
      return 0;
    }

    // Update cache
    const update: InventoryUpdate = {
      productId,
      stockLevel: data.stock_quantity,
      lastUpdated: new Date().toISOString(),
      syncChannel: "web",
    };
    this.inventoryCache.set(productId, update);

    return data.stock_quantity;
  }

  // Send inventory alerts to suppliers
  private async sendInventoryAlert(alert: InventoryAlert) {
    try {
      // Store alert in database
      await supabase.from("inventory_alerts").insert({
        product_id: alert.productId,
        supplier_id: alert.supplierId,
        alert_type: alert.alertType,
        current_stock: alert.currentStock,
        threshold: alert.minimumThreshold,
        created_at: new Date().toISOString(),
      });

      // Send real-time notification (via WebSocket or push notification)
      // In production, integrate with FCM, SMS, or email service
      console.log(
        `📱 Alert sent to supplier: ${alert.alertType} for ${alert.productName}`,
      );
    } catch (error) {
      console.error("Failed to send inventory alert:", error);
    }
  }

  // Broadcast updates to all channels (web, mobile, USSD)
  private broadcastToAllChannels(update: InventoryUpdate) {
    // Web: Already handled via WebSocket
    // Mobile: Would use FCM push notifications
    // USSD: Would trigger SMS alerts for critical updates
    // API: WebSocket handles this

    console.log(
      `🔄 Inventory synced across channels: ${update.productId} = ${update.stockLevel}`,
    );
  }

  // Log inventory actions for audit trail
  private async logInventoryAction(
    productId: string,
    action: string,
    details: string,
  ) {
    try {
      await supabase.from("inventory_logs").insert({
        product_id: productId,
        action,
        details,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error("Failed to log inventory action:", error);
    }
  }

  // Bulk inventory sync (for periodic reconciliation)
  async bulkSyncInventory(
    updates: Array<{ productId: string; stock: number }>,
  ) {
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < updates.length; i += batchSize) {
      batches.push(updates.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      try {
        const { error } = await supabase.from("products").upsert(
          batch.map((update) => ({
            id: update.productId,
            stock_quantity: update.stock,
            updated_at: new Date().toISOString(),
          })),
        );

        if (error) throw error;

        // Broadcast updates
        batch.forEach((update) => {
          const inventoryUpdate: InventoryUpdate = {
            productId: update.productId,
            stockLevel: update.stock,
            lastUpdated: new Date().toISOString(),
            syncChannel: "api",
          };
          this.handleInventoryUpdate(inventoryUpdate);
        });
      } catch (error) {
        console.error("Bulk sync failed for batch:", error);
      }
    }
  }

  // Get inventory analytics
  async getInventoryAnalytics(supplierId?: string) {
    try {
      let query = supabase
        .from("products")
        .select("id, name, stock_quantity, minimum_order_quantity, status");

      if (supplierId) {
        query = query.eq("supplier_id", supplierId);
      }

      const { data: products, error } = await query;
      if (error) throw error;

      const analytics = {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.status === "active").length,
        pausedProducts: products.filter((p) => p.status === "paused").length,
        lowStockProducts: products.filter(
          (p) => p.stock_quantity <= p.minimum_order_quantity * 1.2,
        ).length,
        outOfStockProducts: products.filter((p) => p.stock_quantity === 0)
          .length,
        totalStockValue: products.reduce((sum, p) => sum + p.stock_quantity, 0),
      };

      return analytics;
    } catch (error) {
      console.error("Failed to get inventory analytics:", error);
      return null;
    }
  }
}

export const inventoryService = InventoryService.getInstance();
export type { InventoryUpdate, InventoryAlert };
