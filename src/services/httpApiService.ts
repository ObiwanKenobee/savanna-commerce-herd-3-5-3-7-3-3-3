/**
 * 🦁 Comprehensive HTTP API Service - Complete CRUD Operations
 * Production-ready API service with full HTTP methods and error handling
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// HTTP Response wrapper
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  status: number;
  timestamp: string;
}

// Pagination wrapper
interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// Request options
interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

// Query parameters
interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
}

class HttpApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "X-Client-Version": "1.0.0",
    };
  }

  /**
   * 🔧 HTTP Helper Methods
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit & RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { timeout = 30000, ...requestOptions } = options;

    try {
      // Add authentication token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        this.defaultHeaders["Authorization"] = `Bearer ${session.access_token}`;
      }

      // Setup timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...requestOptions,
        headers: {
          ...this.defaultHeaders,
          ...requestOptions.headers,
        },
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      return {
        data: response.ok ? data : null,
        error: response.ok ? null : data?.message || `HTTP ${response.status}`,
        success: response.ok,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        success: false,
        status: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private buildQueryString(params: QueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "filters" && typeof value === "object") {
          Object.entries(value).forEach(([filterKey, filterValue]) => {
            if (filterValue !== undefined && filterValue !== null) {
              searchParams.append(`filter[${filterKey}]`, String(filterValue));
            }
          });
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  }

  /**
   * 🌐 Generic CRUD Operations
   */

  // CREATE (POST)
  async create<T>(
    endpoint: string,
    data: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // READ (GET) - Single item
  async read<T>(
    endpoint: string,
    id: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${endpoint}/${id}`, {
      method: "GET",
      ...options,
    });
  }

  // READ (GET) - List with pagination
  async list<T>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryString = params ? this.buildQueryString(params) : "";
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.makeRequest<PaginatedResponse<T>>(url, {
      method: "GET",
      ...options,
    });
  }

  // UPDATE (PUT) - Full replace
  async update<T>(
    endpoint: string,
    id: string,
    data: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // UPDATE (PATCH) - Partial update
  async patch<T>(
    endpoint: string,
    id: string,
    data: any,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE
  async delete<T>(
    endpoint: string,
    id: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${endpoint}/${id}`, {
      method: "DELETE",
      ...options,
    });
  }

  // BULK Operations
  async bulkCreate<T>(
    endpoint: string,
    data: any[],
    options?: RequestOptions,
  ): Promise<ApiResponse<T[]>> {
    return this.makeRequest<T[]>(`${endpoint}/bulk`, {
      method: "POST",
      body: JSON.stringify({ items: data }),
      ...options,
    });
  }

  async bulkUpdate<T>(
    endpoint: string,
    updates: Array<{ id: string; data: any }>,
    options?: RequestOptions,
  ): Promise<ApiResponse<T[]>> {
    return this.makeRequest<T[]>(`${endpoint}/bulk`, {
      method: "PATCH",
      body: JSON.stringify({ updates }),
      ...options,
    });
  }

  async bulkDelete<T>(
    endpoint: string,
    ids: string[],
    options?: RequestOptions,
  ): Promise<ApiResponse<T[]>> {
    return this.makeRequest<T[]>(`${endpoint}/bulk`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
      ...options,
    });
  }

  /**
   * 🔍 Search and Filter Operations
   */
  async search<T>(
    endpoint: string,
    query: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const searchParams = { ...params, search: query };
    return this.list<T>(`${endpoint}/search`, searchParams, options);
  }

  async filter<T>(
    endpoint: string,
    filters: Record<string, any>,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const filterParams = { ...params, filters };
    return this.list<T>(endpoint, filterParams, options);
  }

  /**
   * 📊 Analytics and Aggregation Operations
   */
  async analytics<T>(
    endpoint: string,
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : "";
    const url = queryString
      ? `${endpoint}/analytics?${queryString}`
      : `${endpoint}/analytics`;

    return this.makeRequest<T>(url, {
      method: "GET",
      ...options,
    });
  }

  async aggregate<T>(
    endpoint: string,
    aggregation: {
      field: string;
      operation: "sum" | "avg" | "count" | "min" | "max";
    },
    params?: QueryParams,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${endpoint}/aggregate`, {
      method: "POST",
      body: JSON.stringify({ ...aggregation, ...params }),
      ...options,
    });
  }

  /**
   * 📝 File Upload Operations
   */
  async uploadFile(
    endpoint: string,
    file: File,
    metadata?: Record<string, any>,
    options?: RequestOptions,
  ): Promise<ApiResponse<{ url: string; id: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }

    return this.makeRequest<{ url: string; id: string }>(`${endpoint}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type to let browser set boundary for multipart/form-data
        ...Object.fromEntries(
          Object.entries(this.defaultHeaders).filter(
            ([key]) => key !== "Content-Type",
          ),
        ),
      },
      ...options,
    });
  }

  async deleteFile(
    endpoint: string,
    fileId: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`${endpoint}/files/${fileId}`, {
      method: "DELETE",
      ...options,
    });
  }

  /**
   * 🔄 Real-time Operations
   */
  async subscribe<T>(
    endpoint: string,
    callback: (data: T) => void,
    filters?: Record<string, any>,
  ): Promise<() => void> {
    // Use Supabase real-time subscriptions as fallback
    const tableName = endpoint.replace("/api/", "").replace("/", "_");

    let query = supabase
      .channel(tableName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => callback(payload.new as T),
      );

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.filter(key, "eq", value);
      });
    }

    query.subscribe();

    return () => {
      supabase.removeChannel(query);
    };
  }

  /**
   * 📈 Health Check and Status
   */
  async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string; version: string }>
  > {
    return this.makeRequest<{
      status: string;
      timestamp: string;
      version: string;
    }>("/health", {
      method: "GET",
    });
  }

  async getStatus(): Promise<
    ApiResponse<{ services: Record<string, string>; uptime: number }>
  > {
    return this.makeRequest<{
      services: Record<string, string>;
      uptime: number;
    }>("/status", {
      method: "GET",
    });
  }
}

export const httpApi = new HttpApiService();
export default httpApi;
