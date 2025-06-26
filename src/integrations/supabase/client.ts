import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Get environment variables with fallback to development values
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://jklewwlnrlzomkaetjjo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbGV3d2xucmx6b21rYWV0ampvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MTIxNDEsImV4cCI6MjA1MTk4ODE0MX0.8VjOmAuOnX3L6qYBWm5sUSxxu2jA-V-79g60LeFs5dE";

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error(
    "Missing Supabase configuration. Please check your environment variables.",
  );
  throw new Error("Missing Supabase configuration");
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
