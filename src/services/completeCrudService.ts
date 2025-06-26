/**
 * 🦁 Complete Enterprise CRUD Service
 * Full HTTP CRUD operations for all enterprise entities
 */

import { supabase } from "@/integrations/supabase/client";
import httpApi from "./httpApiService";
import { toast } from "@/components/ui/use-toast";

// Entity Types
export interface TradingHub {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  category: string;
  image_url?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  operating_hours?: {
    open: string;
    close: string;
    days: string[];
  };
  specialties: string[];
  stats: {
    active_suppliers: number;
    monthly_volume: number;
    rating: number;
    total_trades: number;
  };
  status: "active" | "pending" | "inactive";
  featured: boolean;
  verified: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  id: string;
  organization_id: string;
  business_name: string;
  owner_name: string;
  business_type: "retailer" | "supplier" | "logistics" | "service_provider";
  description?: string;
  location: string;
  contact_info: {
    email: string;
    phone: string;
    website?: string;
    address?: string;
  };
  specialties: string[];
  categories: string[];
  stats: {
    years_in_business: number;
    total_transactions: number;
    rating: number;
    review_count: number;
    monthly_revenue?: number;
  };
  verification: {
    business_license: boolean;
    tax_compliance: boolean;
    quality_certification: boolean;
    financial_verification: boolean;
  };
  membership_tier: "bronze" | "silver" | "gold" | "platinum";
  joined_date: string;
  last_active: string;
  status: "active" | "inactive" | "suspended";
  featured: boolean;
  premium: boolean;
}

export interface SwiftRetailer {
  id: string;
  business_profile_id: string;
  velocity_score: number;
  performance_metrics: {
    average_order_time: number;
    fulfillment_rate: number;
    customer_satisfaction: number;
    repeat_customer_rate: number;
  };
  speed_indicators: {
    quick_pay: boolean;
    same_day_pickup: boolean;
    express_delivery: boolean;
    instant_quotes: boolean;
  };
  trading_patterns: {
    peak_hours: string[];
    seasonal_trends: any;
    product_preferences: string[];
  };
  tier_classification: "lightning" | "cheetah" | "gazelle" | "standard";
  partnership_status: "open" | "selective" | "closed";
  achievements: string[];
  business_profile?: BusinessProfile;
}

export interface PackStory {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  author_name: string;
  author_role?: string;
  author_organization?: string;
  story_type: "success" | "innovation" | "partnership" | "growth" | "challenge";
  categories: string[];
  tags: string[];
  media: {
    images: string[];
    videos: string[];
    audio: string[];
  };
  impact_metrics: {
    revenue_increase?: number;
    cost_reduction?: number;
    time_saved?: number;
    efficiency_gain?: number;
  };
  engagement: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  status: "draft" | "published" | "archived";
  featured: boolean;
  reading_time?: number;
  location?: string;
  date_occurred?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  supplier_id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  sku: string;
  unit_price: number;
  bulk_price?: number;
  minimum_order_quantity: number;
  stock_quantity: number;
  unit_of_measure: string;
  origin_country?: string;
  certifications?: any[];
  images?: any[];
  specifications?: any;
  status: "active" | "inactive" | "out_of_stock";
  featured: boolean;
  quality_score: number;
  sustainability_rating: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  supplier_id: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  total_amount: number;
  currency: string;
  delivery_address: any;
  delivery_date?: string;
  payment_terms?: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
  tracking_number?: string;
  logistics_provider?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

class CompleteCrudService {
  private static instance: CompleteCrudService;

  static getInstance(): CompleteCrudService {
    if (!CompleteCrudService.instance) {
      CompleteCrudService.instance = new CompleteCrudService();
    }
    return CompleteCrudService.instance;
  }

  /**
   * 🏺 TRADING HUBS CRUD
   */

  // Create Trading Hub
  async createTradingHub(
    data: Omit<TradingHub, "id" | "created_at" | "updated_at">,
  ): Promise<TradingHub> {
    try {
      // Try HTTP API first
      const httpResponse = await httpApi.create<TradingHub>(
        "/trading-hubs",
        data,
      );
      if (httpResponse.success && httpResponse.data) {
        toast({
          title: "Trading Hub Created!",
          description: "Successfully created via API",
        });
        return httpResponse.data;
      }

      // Fallback to Supabase
      const { data: hubData, error } = await supabase
        .from("trading_hubs")
        .insert([
          {
            ...data,
            slug: this.generateSlug(data.name),
            stats: data.stats || {
              active_suppliers: 0,
              monthly_volume: 0,
              rating: 0,
              total_trades: 0,
            },
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Trading Hub Created!",
        description: "Hub created successfully",
      });
      return hubData as TradingHub;
    } catch (error) {
      console.error("Error creating trading hub:", error);
      toast({
        title: "Error",
        description: "Failed to create trading hub",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Read Trading Hubs
  async getTradingHubs(params?: {
    category?: string;
    location?: string;
    search?: string;
    featured?: boolean;
    verified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<TradingHub[]> {
    try {
      // Try HTTP API first
      const httpResponse = await httpApi.list<TradingHub>(
        "/trading-hubs",
        params,
      );
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data.data;
      }

      // Fallback to Supabase
      let query = supabase
        .from("trading_hubs")
        .select("*")
        .eq("status", "active");

      if (params?.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }
      if (params?.location && params.location !== "all") {
        query = query.eq("location", params.location);
      }
      if (params?.search) {
        query = query.or(
          `name.ilike.%${params.search}%,description.ilike.%${params.search}%`,
        );
      }
      if (params?.featured) {
        query = query.eq("featured", true);
      }
      if (params?.verified) {
        query = query.eq("verified", true);
      }

      const { data, error } = await query
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(params?.limit || 50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching trading hubs:", error);
      return [];
    }
  }

  // Update Trading Hub
  async updateTradingHub(
    id: string,
    data: Partial<TradingHub>,
  ): Promise<TradingHub> {
    try {
      // Try HTTP API first
      const httpResponse = await httpApi.update<TradingHub>(
        "/trading-hubs",
        id,
        data,
      );
      if (httpResponse.success && httpResponse.data) {
        toast({
          title: "Hub Updated!",
          description: "Successfully updated via API",
        });
        return httpResponse.data;
      }

      // Fallback to Supabase
      const { data: hubData, error } = await supabase
        .from("trading_hubs")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Hub Updated!",
        description: "Trading hub updated successfully",
      });
      return hubData as TradingHub;
    } catch (error) {
      console.error("Error updating trading hub:", error);
      toast({
        title: "Error",
        description: "Failed to update trading hub",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Delete Trading Hub
  async deleteTradingHub(id: string): Promise<void> {
    try {
      // Try HTTP API first
      const httpResponse = await httpApi.delete("/trading-hubs", id);
      if (httpResponse.success) {
        toast({
          title: "Hub Deleted!",
          description: "Successfully deleted via API",
        });
        return;
      }

      // Fallback to Supabase
      const { error } = await supabase
        .from("trading_hubs")
        .delete()
        .eq("id", id);
      if (error) throw error;

      toast({
        title: "Hub Deleted!",
        description: "Trading hub deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting trading hub:", error);
      toast({
        title: "Error",
        description: "Failed to delete trading hub",
        variant: "destructive",
      });
      throw error;
    }
  }

  /**
   * 👥 BUSINESS PROFILES CRUD
   */

  async createBusinessProfile(
    data: Omit<BusinessProfile, "id" | "joined_date" | "last_active">,
  ): Promise<BusinessProfile> {
    try {
      const httpResponse = await httpApi.create<BusinessProfile>(
        "/business-profiles",
        data,
      );
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data;
      }

      const { data: profileData, error } = await supabase
        .from("business_profiles")
        .insert([
          {
            ...data,
            stats: data.stats || {
              years_in_business: 0,
              total_transactions: 0,
              rating: 0,
              review_count: 0,
            },
            verification: data.verification || {
              business_license: false,
              tax_compliance: false,
              quality_certification: false,
              financial_verification: false,
            },
          },
        ])
        .select()
        .single();

      if (error) throw error;
      toast({
        title: "Profile Created!",
        description: "Business profile created successfully",
      });
      return profileData as BusinessProfile;
    } catch (error) {
      console.error("Error creating business profile:", error);
      throw error;
    }
  }

  async getBusinessProfiles(params?: {
    business_type?: string;
    location?: string;
    search?: string;
    membership_tier?: string;
    featured?: boolean;
  }): Promise<BusinessProfile[]> {
    try {
      const httpResponse = await httpApi.list<BusinessProfile>(
        "/business-profiles",
        params,
      );
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data.data;
      }

      let query = supabase
        .from("business_profiles")
        .select("*")
        .eq("status", "active");

      if (params?.business_type && params.business_type !== "all") {
        query = query.eq("business_type", params.business_type);
      }
      if (params?.search) {
        query = query.or(
          `business_name.ilike.%${params.search}%,description.ilike.%${params.search}%`,
        );
      }

      const { data, error } = await query.order("featured", {
        ascending: false,
      });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching business profiles:", error);
      return [];
    }
  }

  /**
   * ⚡ SWIFT RETAILERS CRUD
   */

  async getSwiftRetailers(params?: {
    tier_classification?: string;
    partnership_status?: string;
    min_velocity_score?: number;
  }): Promise<SwiftRetailer[]> {
    try {
      const httpResponse = await httpApi.list<SwiftRetailer>(
        "/swift-retailers",
        params,
      );
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data.data;
      }

      let query = supabase.from("swift_retailers").select(`
        *,
        business_profile:business_profiles(*)
      `);

      if (params?.tier_classification && params.tier_classification !== "all") {
        query = query.eq("tier_classification", params.tier_classification);
      }

      const { data, error } = await query.order("velocity_score", {
        ascending: false,
      });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching swift retailers:", error);
      return [];
    }
  }

  async updateVelocityScore(
    retailerId: string,
    newScore: number,
  ): Promise<void> {
    try {
      const httpResponse = await httpApi.patch("/swift-retailers", retailerId, {
        velocity_score: newScore,
      });
      if (httpResponse.success) {
        toast({
          title: "Velocity Updated!",
          description: "Retailer velocity score updated",
        });
        return;
      }

      const { error } = await supabase
        .from("swift_retailers")
        .update({
          velocity_score: newScore,
          updated_at: new Date().toISOString(),
        })
        .eq("id", retailerId);

      if (error) throw error;
      toast({
        title: "Velocity Updated!",
        description: "Retailer velocity score updated",
      });
    } catch (error) {
      console.error("Error updating velocity score:", error);
      throw error;
    }
  }

  /**
   * 📚 PACK STORIES CRUD
   */

  async createPackStory(
    data: Omit<PackStory, "id" | "created_at" | "updated_at" | "engagement">,
  ): Promise<PackStory> {
    try {
      const storyData = {
        ...data,
        reading_time: this.calculateReadingTime(data.content),
        engagement: { views: 0, likes: 0, shares: 0, comments: 0 },
        published_at:
          data.status === "published" ? new Date().toISOString() : null,
      };

      const httpResponse = await httpApi.create<PackStory>(
        "/pack-stories",
        storyData,
      );
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data;
      }

      const { data: story, error } = await supabase
        .from("pack_stories")
        .insert([storyData])
        .select()
        .single();

      if (error) throw error;
      toast({
        title: "Story Created!",
        description: "Pack story created successfully",
      });
      return story as PackStory;
    } catch (error) {
      console.error("Error creating pack story:", error);
      throw error;
    }
  }

  async getPackStories(params?: {
    story_type?: string;
    category?: string;
    search?: string;
    featured?: boolean;
    author_id?: string;
  }): Promise<PackStory[]> {
    try {
      const httpResponse = await httpApi.list<PackStory>(
        "/pack-stories",
        params,
      );
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data.data;
      }

      let query = supabase
        .from("pack_stories")
        .select("*")
        .eq("status", "published");

      if (params?.story_type && params.story_type !== "all") {
        query = query.eq("story_type", params.story_type);
      }
      if (params?.search) {
        query = query.or(
          `title.ilike.%${params.search}%,content.ilike.%${params.search}%`,
        );
      }

      const { data, error } = await query.order("featured", {
        ascending: false,
      });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching pack stories:", error);
      return [];
    }
  }

  async incrementStoryViews(storyId: string): Promise<void> {
    try {
      const httpResponse = await httpApi.patch("/pack-stories", storyId, {
        increment: "views",
      });
      if (httpResponse.success) return;

      await supabase.rpc("increment_story_views", { story_id: storyId });
    } catch (error) {
      console.error("Error incrementing story views:", error);
    }
  }

  /**
   * 📦 PRODUCTS CRUD
   */

  async createProduct(
    data: Omit<Product, "id" | "created_at" | "updated_at">,
  ): Promise<Product> {
    try {
      const httpResponse = await httpApi.create<Product>("/products", data);
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data;
      }

      const { data: product, error } = await supabase
        .from("products")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      toast({
        title: "Product Created!",
        description: "Product added successfully",
      });
      return product as Product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async getProducts(params?: {
    category?: string;
    supplier_id?: string;
    search?: string;
    status?: string;
    featured?: boolean;
  }): Promise<Product[]> {
    try {
      const httpResponse = await httpApi.list<Product>("/products", params);
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data.data;
      }

      let query = supabase
        .from("products")
        .select("*, supplier:organizations!supplier_id(name, country)");

      if (params?.category) {
        query = query.eq("category", params.category);
      }
      if (params?.status) {
        query = query.eq("status", params.status);
      } else {
        query = query.eq("status", "active");
      }

      const { data, error } = await query.order("featured", {
        ascending: false,
      });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  /**
   * 🛒 ORDERS CRUD
   */

  async createOrder(
    data: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">,
  ): Promise<Order> {
    try {
      const orderData = {
        ...data,
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      const httpResponse = await httpApi.create<Order>("/orders", orderData);
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data;
      }

      const { data: order, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      toast({
        title: "Order Created!",
        description: `Order ${orderData.order_number} created`,
      });
      return order as Order;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrders(params?: {
    buyer_id?: string;
    supplier_id?: string;
    status?: string;
    created_by?: string;
  }): Promise<Order[]> {
    try {
      const httpResponse = await httpApi.list<Order>("/orders", params);
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data.data;
      }

      let query = supabase.from("orders").select(`
        *,
        buyer:organizations!buyer_id(name),
        supplier:organizations!supplier_id(name),
        order_items(*)
      `);

      if (params?.buyer_id) {
        query = query.eq("buyer_id", params.buyer_id);
      }
      if (params?.supplier_id) {
        query = query.eq("supplier_id", params.supplier_id);
      }
      if (params?.status) {
        query = query.eq("status", params.status);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }

  /**
   * 📊 ANALYTICS AND REPORTING
   */

  async getEnterpriseAnalytics(): Promise<{
    totalHubs: number;
    totalProfiles: number;
    totalStories: number;
    totalTransactions: number;
    monthlyGrowth: number;
    topCategories: Array<{ category: string; count: number }>;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: string;
    }>;
  }> {
    try {
      const httpResponse = await httpApi.analytics("/enterprise");
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data;
      }

      // Fallback to manual aggregation
      const [hubsResult, profilesResult, storiesResult, ordersResult] =
        await Promise.all([
          supabase
            .from("trading_hubs")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("business_profiles")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("pack_stories")
            .select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
        ]);

      return {
        totalHubs: hubsResult.count || 0,
        totalProfiles: profilesResult.count || 0,
        totalStories: storiesResult.count || 0,
        totalTransactions: ordersResult.count || 0,
        monthlyGrowth: 15, // Mock data
        topCategories: [
          { category: "Agriculture", count: 45 },
          { category: "Electronics", count: 32 },
          { category: "Fashion", count: 28 },
        ],
        recentActivity: [
          {
            type: "hub_created",
            description: "New trading hub in Nakuru",
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }

  /**
   * 🔧 UTILITY METHODS
   */

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * 🔄 REAL-TIME SUBSCRIPTIONS
   */

  subscribeToEntityChanges<T>(
    entity: string,
    callback: (data: T) => void,
    filters?: Record<string, any>,
  ): () => void {
    const channel = supabase
      .channel(`${entity}_changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: entity },
        (payload) => callback(payload.new as T),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  /**
   * 📤 BULK OPERATIONS
   */

  async bulkCreateProducts(
    products: Omit<Product, "id" | "created_at" | "updated_at">[],
  ): Promise<Product[]> {
    try {
      const httpResponse = await httpApi.bulkCreate<Product>(
        "/products",
        products,
      );
      if (httpResponse.success && httpResponse.data) {
        return httpResponse.data;
      }

      const { data, error } = await supabase
        .from("products")
        .insert(products)
        .select();
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error bulk creating products:", error);
      throw error;
    }
  }

  async bulkUpdateOrderStatus(
    orderIds: string[],
    status: string,
  ): Promise<void> {
    try {
      const updates = orderIds.map((id) => ({ id, data: { status } }));
      const httpResponse = await httpApi.bulkUpdate("/orders", updates);
      if (httpResponse.success) return;

      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .in("id", orderIds);

      if (error) throw error;
      toast({
        title: "Orders Updated!",
        description: `${orderIds.length} orders updated`,
      });
    } catch (error) {
      console.error("Error bulk updating orders:", error);
      throw error;
    }
  }
}

export const crudService = CompleteCrudService.getInstance();
export default crudService;
