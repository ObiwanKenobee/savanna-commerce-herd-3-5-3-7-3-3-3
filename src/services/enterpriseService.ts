import { supabase } from "@/integrations/supabase/client";

// Types for enterprise features
export interface TradingHub {
  id?: string;
  name: string;
  description: string;
  location: string;
  category: string;
  active_suppliers: number;
  active_retailers: number;
  total_volume: number;
  rating: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  status: "active" | "pending" | "inactive";
  featured: boolean;
  contact_info?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  operating_hours?: {
    open: string;
    close: string;
    days: string[];
  };
  specialties?: string[];
  image_url?: string;
}

export interface SupplierProfile {
  id?: string;
  user_id: string;
  business_name: string;
  description: string;
  location: string;
  categories: string[];
  rating: number;
  total_orders: number;
  years_experience: number;
  certifications: string[];
  contact_info: {
    email: string;
    phone: string;
    website?: string;
    address: string;
  };
  business_info: {
    registration_number?: string;
    tax_id?: string;
    employee_count?: number;
    annual_revenue?: string;
  };
  verification_status: "pending" | "verified" | "rejected";
  featured: boolean;
  created_at?: string;
  updated_at?: string;
  status: "active" | "suspended" | "inactive";
  profile_image?: string;
  cover_image?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface RetailerProfile {
  id?: string;
  user_id: string;
  business_name: string;
  description: string;
  location: string;
  business_type: string;
  monthly_volume: number;
  preferred_categories: string[];
  rating: number;
  total_purchases: number;
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
  business_info: {
    registration_number?: string;
    tax_id?: string;
    store_count?: number;
    target_market?: string;
  };
  verification_status: "pending" | "verified" | "rejected";
  created_at?: string;
  updated_at?: string;
  status: "active" | "suspended" | "inactive";
  profile_image?: string;
  preferences: {
    payment_terms?: string;
    delivery_preferences?: string[];
    communication_method?: string;
  };
}

export interface PackStory {
  id?: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_role: string;
  category: "success" | "case_study" | "innovation" | "partnership" | "growth";
  tags: string[];
  reading_time: number;
  featured_image?: string;
  published: boolean;
  publish_date?: string;
  views: number;
  likes: number;
  created_at?: string;
  updated_at?: string;
  excerpt?: string;
  related_stories?: string[];
}

class EnterpriseService {
  // Trading Hubs CRUD Operations
  async getTradingHubs(filters?: {
    location?: string;
    category?: string;
    status?: string;
    featured?: boolean;
  }): Promise<TradingHub[]> {
    try {
      let query = supabase
        .from("trading_hubs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.featured !== undefined) {
        query = query.eq("featured", filters.featured);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching trading hubs:", error);
      throw error;
    }
  }

  async getTradingHub(id: string): Promise<TradingHub | null> {
    try {
      const { data, error } = await supabase
        .from("trading_hubs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching trading hub:", error);
      throw error;
    }
  }

  async createTradingHub(
    hubData: Omit<TradingHub, "id" | "created_at" | "updated_at">,
  ): Promise<TradingHub> {
    try {
      const { data, error } = await supabase
        .from("trading_hubs")
        .insert({
          ...hubData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating trading hub:", error);
      throw error;
    }
  }

  async updateTradingHub(
    id: string,
    updates: Partial<TradingHub>,
  ): Promise<TradingHub> {
    try {
      const { data, error } = await supabase
        .from("trading_hubs")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating trading hub:", error);
      throw error;
    }
  }

  async deleteTradingHub(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("trading_hubs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting trading hub:", error);
      throw error;
    }
  }

  // Supplier Profiles CRUD Operations
  async getSupplierProfiles(filters?: {
    location?: string;
    category?: string;
    verification_status?: string;
    featured?: boolean;
  }): Promise<SupplierProfile[]> {
    try {
      let query = supabase
        .from("supplier_profiles")
        .select("*")
        .eq("status", "active")
        .order("rating", { ascending: false });

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters?.category) {
        query = query.contains("categories", [filters.category]);
      }
      if (filters?.verification_status) {
        query = query.eq("verification_status", filters.verification_status);
      }
      if (filters?.featured !== undefined) {
        query = query.eq("featured", filters.featured);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching supplier profiles:", error);
      throw error;
    }
  }

  async getSupplierProfile(id: string): Promise<SupplierProfile | null> {
    try {
      const { data, error } = await supabase
        .from("supplier_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching supplier profile:", error);
      throw error;
    }
  }

  async createSupplierProfile(
    profileData: Omit<SupplierProfile, "id" | "created_at" | "updated_at">,
  ): Promise<SupplierProfile> {
    try {
      const { data, error } = await supabase
        .from("supplier_profiles")
        .insert({
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating supplier profile:", error);
      throw error;
    }
  }

  async updateSupplierProfile(
    id: string,
    updates: Partial<SupplierProfile>,
  ): Promise<SupplierProfile> {
    try {
      const { data, error } = await supabase
        .from("supplier_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating supplier profile:", error);
      throw error;
    }
  }

  async deleteSupplierProfile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("supplier_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting supplier profile:", error);
      throw error;
    }
  }

  // Retailer Profiles CRUD Operations
  async getRetailerProfiles(filters?: {
    location?: string;
    business_type?: string;
    verification_status?: string;
  }): Promise<RetailerProfile[]> {
    try {
      let query = supabase
        .from("retailer_profiles")
        .select("*")
        .eq("status", "active")
        .order("total_purchases", { ascending: false });

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters?.business_type) {
        query = query.eq("business_type", filters.business_type);
      }
      if (filters?.verification_status) {
        query = query.eq("verification_status", filters.verification_status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching retailer profiles:", error);
      throw error;
    }
  }

  async getRetailerProfile(id: string): Promise<RetailerProfile | null> {
    try {
      const { data, error } = await supabase
        .from("retailer_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching retailer profile:", error);
      throw error;
    }
  }

  async createRetailerProfile(
    profileData: Omit<RetailerProfile, "id" | "created_at" | "updated_at">,
  ): Promise<RetailerProfile> {
    try {
      const { data, error } = await supabase
        .from("retailer_profiles")
        .insert({
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating retailer profile:", error);
      throw error;
    }
  }

  async updateRetailerProfile(
    id: string,
    updates: Partial<RetailerProfile>,
  ): Promise<RetailerProfile> {
    try {
      const { data, error } = await supabase
        .from("retailer_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating retailer profile:", error);
      throw error;
    }
  }

  async deleteRetailerProfile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("retailer_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting retailer profile:", error);
      throw error;
    }
  }

  // Pack Stories CRUD Operations
  async getPackStories(filters?: {
    category?: string;
    author_role?: string;
    published?: boolean;
    featured?: boolean;
  }): Promise<PackStory[]> {
    try {
      let query = supabase
        .from("pack_stories")
        .select("*")
        .order("publish_date", { ascending: false });

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.author_role) {
        query = query.eq("author_role", filters.author_role);
      }
      if (filters?.published !== undefined) {
        query = query.eq("published", filters.published);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching pack stories:", error);
      throw error;
    }
  }

  async getPackStory(id: string): Promise<PackStory | null> {
    try {
      const { data, error } = await supabase
        .from("pack_stories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Increment view count
      if (data) {
        await this.incrementStoryViews(id);
      }

      return data;
    } catch (error) {
      console.error("Error fetching pack story:", error);
      throw error;
    }
  }

  async createPackStory(
    storyData: Omit<
      PackStory,
      "id" | "created_at" | "updated_at" | "views" | "likes"
    >,
  ): Promise<PackStory> {
    try {
      const { data, error } = await supabase
        .from("pack_stories")
        .insert({
          ...storyData,
          views: 0,
          likes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating pack story:", error);
      throw error;
    }
  }

  async updatePackStory(
    id: string,
    updates: Partial<PackStory>,
  ): Promise<PackStory> {
    try {
      const { data, error } = await supabase
        .from("pack_stories")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating pack story:", error);
      throw error;
    }
  }

  async deletePackStory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("pack_stories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting pack story:", error);
      throw error;
    }
  }

  async incrementStoryViews(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("increment_story_views", {
        story_id: id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error incrementing story views:", error);
    }
  }

  async likeStory(id: string): Promise<void> {
    try {
      const { error } = await supabase.rpc("increment_story_likes", {
        story_id: id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error liking story:", error);
    }
  }

  // Analytics and Reporting
  async getEnterpriseAnalytics(): Promise<any> {
    try {
      const [
        hubsResponse,
        suppliersResponse,
        retailersResponse,
        storiesResponse,
      ] = await Promise.all([
        supabase
          .from("trading_hubs")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("supplier_profiles")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("retailer_profiles")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("pack_stories")
          .select("*", { count: "exact", head: true }),
      ]);

      return {
        trading_hubs: hubsResponse.count || 0,
        suppliers: suppliersResponse.count || 0,
        retailers: retailersResponse.count || 0,
        stories: storiesResponse.count || 0,
      };
    } catch (error) {
      console.error("Error fetching enterprise analytics:", error);
      throw error;
    }
  }
}

export const enterpriseService = new EnterpriseService();
export default enterpriseService;
