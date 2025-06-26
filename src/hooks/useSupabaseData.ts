
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

// TypeScript interfaces
export interface Organization {
  id: string;
  name: string;
  organization_type: string;
  country: string;
  region: string;
  industry: string;
  annual_revenue?: number;
  employee_count?: number;
  verification_status: string;
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
  status: string;
  created_at: string;
  updated_at: string;
  supplier?: {
    name: string;
    country: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  supplier_id: string;
  status: string;
  total_amount: number;
  currency: string;
  delivery_address: any;
  delivery_date?: string;
  payment_terms?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  buyer?: {
    name: string;
  };
  supplier?: {
    name: string;
  };
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
  product?: {
    name: string;
    sku: string;
  };
}

export interface InnovationProject {
  id: string;
  organization_id?: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  budget?: number;
  expected_roi?: number;
  start_date?: string;
  target_completion?: string;
  team_members?: any[];
  milestones?: any[];
  created_by?: string;
  created_at: string;
  updated_at: string;
  organization?: {
    name: string;
  };
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id?: string;
  organization_id?: string;
  event_data?: any;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async (): Promise<Organization[]> => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          supplier:organizations!supplier_id(name, country)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:organizations!buyer_id(name),
          supplier:organizations!supplier_id(name),
          order_items(
            *,
            product:products(name, sku)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useInnovationProjects = () => {
  return useQuery({
    queryKey: ['innovation_projects'],
    queryFn: async (): Promise<InnovationProject[]> => {
      const { data, error } = await supabase
        .from('innovation_projects')
        .select(`
          *,
          organization:organizations(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAnalyticsEvents = () => {
  return useQuery({
    queryKey: ['analytics_events'],
    queryFn: async (): Promise<AnalyticsEvent[]> => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order Created",
        description: "Your order has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Order Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product Added",
        description: "Your product has been successfully added to the catalog.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Product Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRealTimeOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const channel = supabase
      .channel('orders_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('Order update:', payload);
        // Handle real-time order updates
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [payload.new as Order, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(order => 
            order.id === (payload.new as Order).id ? payload.new as Order : order
          ));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return orders;
};

export const useTrackAnalytics = () => {
  return useMutation({
    mutationFn: async ({ eventType, eventData }: { eventType: string; eventData?: any }) => {
      const { data, error } = await supabase.rpc('track_analytics_event', {
        p_event_type: eventType,
        p_event_data: eventData || {}
      });
      
      if (error) throw error;
      return data;
    },
  });
};

// Export as a namespace for backward compatibility
export const useSupabaseData = {
  useOrganizations,
  useProducts,
  useOrders,
  useInnovationProjects,
  useAnalyticsEvents,
};
