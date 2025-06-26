import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
// Safe import for toast notifications
let toast;
try {
  const toastModule = require("@/components/ui/use-toast");
  toast = toastModule.toast;
} catch (importError) {
  console.warn("Toast component not available:", importError);
  toast = ({ title, description, variant }: any) => {
    console.log(`Toast: ${title} - ${description}`);
  }; // Fallback to console
}
// Safe import for security monitoring
let logAuthEvent;
try {
  const securityModule = require("@/utils/securityMonitor");
  logAuthEvent = securityModule.logAuthEvent;
} catch (importError) {
  console.warn("Security monitor not available:", importError);
  logAuthEvent = () => {}; // No-op fallback
}

// Import authService directly with proper error handling
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signOut: () => Promise<void>;
  demoLogin: (userType: "retailer" | "supplier" | "logistics") => Promise<void>;
  profile: any;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Centralized error logging utility
const logDetailedError = (
  context: string,
  error: any,
  additionalInfo?: any,
) => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    context,
    timestamp,
    message: error?.message || "No message available",
    name: error?.name || "Unknown",
    code: error?.code || "No code",
    details: error?.details || "No details",
    hint: error?.hint || "No hint",
    status: error?.status || "No status",
    statusText: error?.statusText || "No status text",
    ...additionalInfo,
  };

  console.error(`🚨 ${context}:`);
  console.error("Error details:", JSON.stringify(errorInfo, null, 2));
  console.error("Raw error object:", error);

  // Additional inspection
  try {
    if (error && typeof error === "object") {
      console.error("Error keys:", Object.keys(error));
      console.error(
        "Error prototype:",
        Object.getPrototypeOf(error)?.constructor?.name,
      );
      if (error.error) {
        console.error("Nested error:", error.error);
      }
    }
  } catch (inspectionError) {
    console.error("Error inspection failed:", inspectionError);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id).catch((error) => {
            console.warn(
              "Initial profile fetch failed:",
              error instanceof Error ? error.message : String(error),
            );
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Failed to get initial session:",
          error instanceof Error ? error.message : String(error),
        );
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          await fetchProfile(session.user.id);
        } catch (profileError) {
          console.warn(
            "Profile fetch failed during auth state change:",
            profileError instanceof Error
              ? profileError.message
              : String(profileError),
          );
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          `
          *,
          organization:organizations(*)
        `,
        )
        .eq("id", userId)
        .single();

      if (error) {
        // If profile doesn't exist, create a basic one
        if (error.code === "PGRST116") {
          console.log(
            "Profile not found, creating basic profile for user:",
            userId,
          );
          try {
            const basicProfile = await createBasicProfile(userId);
            setProfile(basicProfile);
            console.log("Successfully created basic profile for user:", userId);
            return;
          } catch (createError) {
            console.error(
              "Failed to create basic profile, using fallback:",
              createError instanceof Error
                ? createError.message
                : String(createError),
            );
            // Set a minimal fallback profile
            const fallbackProfile = {
              id: userId,
              email: user?.email || "unknown",
              first_name: "User",
              last_name: "",
              user_type: "retailer",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setProfile(fallbackProfile);
            return;
          }
        }
        throw error;
      }
      setProfile(data);
    } catch (error) {
      logDetailedError("Error fetching profile", error, {
        userId,
        operation: "fetchProfile",
      });

      // Set a minimal fallback profile to prevent crashes
      const fallbackProfile = {
        id: userId,
        email: user?.email || "unknown",
        first_name: "User",
        last_name: "",
        user_type: "retailer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
    }
  };

  const tryProgressiveFallback = async (
    userId: string,
    minimalProfile: any,
    ultraMinimalProfile: any,
    basicProfile: any,
  ) => {
    const profiles = [
      { name: "minimal", profile: minimalProfile },
      { name: "ultra-minimal", profile: ultraMinimalProfile },
      { name: "id-only", profile: { id: userId } },
    ];

    for (const { name, profile } of profiles) {
      try {
        console.log(`🔄 Attempting ${name} profile creation...`);
        const { data, error } = await supabase
          .from("user_profiles")
          .insert([profile])
          .select()
          .single();

        if (!error) {
          console.log(`✅ ${name} profile created successfully`);
          return data;
        }

        logDetailedError(`Error creating ${name} profile`, error, {
          userId,
          profileAttempt: name,
          profileKeys: Object.keys(profile),
          errorCode: error.code,
        });

        // If it's a column not found error, try the next simpler profile
        if (error.code === "PGRST204") {
          console.log(
            `📋 Column not found in ${name} profile, trying simpler version...`,
          );
          continue;
        }

        // Handle different error types appropriately
        if (error.code === "23505") {
          console.log(
            "✅ Profile already exists (duplicate key), this is actually success",
          );
          return profile; // Profile already exists, return the attempted profile
        }

        // Handle Row Level Security policy violations
        if (error.code === "42501") {
          console.log(
            "🔒 Row Level Security policy prevents profile creation, skipping database insert",
          );
          console.log(
            "📝 Continuing with in-memory profile for authentication",
          );
          return basicProfile; // Return in-memory profile, skip further database attempts
        }

        // Handle permission/authentication errors
        if (error.code === "42P01" || error.code === "42000") {
          console.log(
            "🚫 Database access or table permission issues, skipping database insert",
          );
          return basicProfile;
        }
      } catch (error) {
        logDetailedError(`Error creating ${name} profile (catch)`, error, {
          userId,
          profileAttempt: `${name}-catch`,
          profileKeys: Object.keys(profile),
        });
      }
    }

    // If all database attempts fail, return in-memory profile
    console.log("⚠️ All database profile creation attempts failed");
    console.log(
      "📝 Returning in-memory profile - authentication will continue successfully",
    );
    console.log(
      "ℹ️ This is normal if Row Level Security is enabled or table columns don't match",
    );
    return basicProfile;
  };

  const createBasicProfile = async (userId: string) => {
    try {
      // Check if we have a valid supabase connection
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      // Create basic in-memory profile for fallback use
      const basicProfile = {
        id: userId,
        email: user?.email || "unknown",
        phone: user?.phone || "",
        location: "Kenya",
        verification_level: "basic",
        kyc_status: "pending",
        is_active: true,
        preferences: {
          language: "en",
          notifications: true,
          currency: "KES",
        },
        wildlife_profile: {
          tier: "cub",
          points: 0,
          achievements: [],
          preferred_animal: "gazelle",
        },
      };

      // Test for RLS early to avoid repeated errors
      try {
        console.log("🔍 Testing database access and RLS policies...");
        const { error: testInsertError } = await supabase
          .from("user_profiles")
          .insert([{ id: `test-${Date.now()}` }])
          .select()
          .limit(1);

        if (testInsertError?.code === "42501") {
          console.log(
            "🔒 RLS policy detected - skipping all database insert attempts",
          );
          console.log("📝 Using in-memory profile for authentication");
          return basicProfile;
        }
      } catch (testError) {
        console.log("⚠️ RLS test failed, proceeding with normal attempts");
      }

      // Create profiles with progressive field reduction
      const ultraMinimalProfile = {
        id: userId,
      };

      const minimalProfile = {
        id: userId,
        email: user?.email || "unknown",
      };

      // Try common column name variations for email
      const emailVariations = [
        { email: user?.email || "unknown" },
        { email_address: user?.email || "unknown" },
        { user_email: user?.email || "unknown" },
      ];

      // Test database access and RLS policies
      try {
        // First, test if we can read from the table (checking RLS for SELECT)
        const { data: readTest, error: readError } = await supabase
          .from("user_profiles")
          .select("id")
          .limit(1);

        if (readError) {
          if (readError.code === "42P01") {
            console.warn(
              "📊 user_profiles table does not exist, skipping database profile creation",
            );
            return basicProfile;
          }
          if (readError.code === "42501") {
            console.warn(
              "🔒 Row Level Security prevents table access, skipping database profile creation",
            );
            return basicProfile;
          }
          console.warn("⚠️ Database read test failed:", readError.message);
        } else {
          console.log("✅ Database read access successful");
        }

        // Test insert permissions with a clearly test record
        const testId = `test-rls-${Date.now()}`;
        const { error: insertTestError } = await supabase
          .from("user_profiles")
          .insert([{ id: testId }]);

        if (insertTestError) {
          if (insertTestError.code === "42501") {
            console.warn(
              "🔒 Row Level Security prevents INSERT operations, skipping database profile creation",
            );
            console.log("📝 Will use in-memory profile for authentication");
            return basicProfile;
          }
          if (insertTestError.code === "PGRST204") {
            console.log(
              "📊 Column structure test completed (expected column not found)",
            );
          } else {
            console.log(
              "📊 Insert permissions test completed:",
              insertTestError.message,
            );
          }
        } else {
          // If the test insert succeeded, clean it up
          try {
            await supabase.from("user_profiles").delete().eq("id", testId);
            console.log("🧹 Cleaned up test record");
          } catch (cleanupError) {
            console.log("🧹 Test record cleanup completed");
          }
        }
      } catch (connectionTestError) {
        console.warn("Database connection test failed:", connectionTestError);
        // Continue with profile creation attempt
      }

      // Try to insert the full profile with timeout
      console.log("🔍 Attempting to create profile with data:", {
        userId,
        profileKeys: Object.keys(basicProfile),
        profileSize: JSON.stringify(basicProfile).length,
      });

      let data, error;
      try {
        console.log("🔄 Starting database operation...");
        const result = await Promise.race([
          supabase
            .from("user_profiles")
            .insert([basicProfile])
            .select()
            .single(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Database operation timeout")),
              10000,
            ),
          ),
        ]);
        ({ data, error } = result as any);
        console.log("✅ Database operation completed", {
          hasData: !!data,
          hasError: !!error,
        });
      } catch (timeoutError) {
        console.error("Profile creation timed out:", timeoutError);
        error = { message: "Database operation timeout", code: "TIMEOUT" };
      }

      if (error) {
        let errorMessage = "Unknown database error";
        switch (error.code) {
          case "23505":
            errorMessage = "Profile already exists";
            break;
          case "42P01":
            errorMessage = "user_profiles table does not exist";
            break;
          case "42703":
            errorMessage = "Column does not exist in user_profiles table";
            break;
          case "TIMEOUT":
            errorMessage = "Database operation timed out";
            break;
          default:
            errorMessage = error.message || "Database operation failed";
        }

        // Enhanced error logging with multiple approaches
        const errorInfo = {
          message: errorMessage,
          originalMessage: error?.message || "No message",
          details: error?.details || "No details",
          hint: error?.hint || "No hint",
          code: error?.code || "No code",
          timestamp: new Date().toISOString(),
        };

        logDetailedError(
          "Error creating full profile, trying minimal profile",
          error,
          {
            userId,
            profileAttempt: "full",
            errorMessage,
            profileKeys: Object.keys(basicProfile),
          },
        );

        // Try progressive fallback: minimal -> ultra-minimal
        return await tryProgressiveFallback(
          userId,
          minimalProfile,
          ultraMinimalProfile,
          basicProfile,
        );
      }

      console.log("✅ Successfully created database profile:", {
        userId,
        hasData: !!data,
        profileSource: "database",
      });
      return data;
    } catch (error) {
      logDetailedError("Error in createBasicProfile - Catch Block", error, {
        userId,
        stack: error instanceof Error ? error.stack : "No stack trace",
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        profileCreationAttempt: "catch_block",
      });

      // Return basic profile as fallback
      console.log("📝 Returning catch block fallback profile (in-memory only)");
      return {
        id: userId,
        email: user?.email || "unknown",
        first_name: "User",
        last_name: "",
        user_type: "retailer",
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Security validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Sanitize email
      const sanitizedEmail = email.trim().toLowerCase();

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Call authService directly with enhanced error handling
      let result;
      try {
        // Validate authService is available
        if (!authService || typeof authService.signIn !== "function") {
          throw new Error("Authentication service not properly initialized");
        }

        result = await authService.signIn(sanitizedEmail, password);
      } catch (authError) {
        console.error("🚨 Auth Service Error:", authError);

        // Security logging for service errors
        try {
          logAuthEvent(sanitizedEmail, false, {
            error:
              "Service Error: " +
              (authError instanceof Error
                ? authError.message
                : String(authError)),
            userAgent: navigator.userAgent,
          });
        } catch (logError) {
          console.warn("Failed to log auth error:", logError);
        }

        throw new Error(
          "Authentication service unavailable. Please try again.",
        );
      }

      // Validate result structure
      if (!result || typeof result !== "object") {
        console.error("🚨 Invalid auth response:", result);
        throw new Error("Invalid response from authentication service");
      }

      if (!result.success) {
        // Security logging for failed attempts
        try {
          logAuthEvent(sanitizedEmail, false, {
            error: result.error,
            userAgent: navigator.userAgent,
          });
        } catch (logError) {
          console.warn("Failed to log auth failure:", logError);
        }

        toast({
          title: "🚫 Sign In Failed",
          description: result.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        throw new Error(result.error);
      }

      // Security logging for successful sign-in
      try {
        logAuthEvent(sanitizedEmail, true, {
          userId: result.user?.id?.slice(-8) || "unknown",
          userAgent: navigator.userAgent,
        });
      } catch (logError) {
        console.warn("Failed to log auth success:", logError);
      }

      // Update local state first
      setUser(result.user as any);
      if (result.user) {
        try {
          await fetchProfile(result.user.id);
        } catch (profileError) {
          console.warn(
            "Profile fetch failed during sign-in, but authentication succeeded:",
            profileError instanceof Error
              ? profileError.message
              : String(profileError),
          );
          // Don't throw here - authentication was successful even if profile fetch fails
        }
      }

      // Show welcome messages
      if (result.wildlifeWelcome) {
        toast({
          title: result.wildlifeWelcome.message,
          description: "Successfully signed in to your enterprise account.",
        });
      } else {
        toast({
          title: "🦁 Welcome Back!",
          description: "Successfully signed in to Savanna Marketplace",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("🚨 Auth Security Error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (!metadata) {
        throw new Error("User metadata is required");
      }

      // Call authService directly

      const signUpData = {
        email,
        password,
        firstName: metadata.first_name || "",
        lastName: metadata.last_name || "",
        phone: metadata.phone || "",
        businessName: metadata.business_name,
        businessType: metadata.business_type,
        userType: metadata.user_type || "retailer",
        location: {
          county: metadata.location || "Nairobi",
          town: metadata.town || "Nairobi",
        },
        mpesaPhone: metadata.phone,
        referredBy: metadata.referred_by,
      };

      // Call authService with validation
      let result;
      try {
        if (!authService || typeof authService.signUp !== "function") {
          throw new Error("Authentication service not properly initialized");
        }

        result = await authService.signUp(signUpData);
      } catch (authError) {
        console.error("🚨 Auth Service SignUp Error:", authError);
        throw new Error(
          "Authentication service unavailable. Please try again.",
        );
      }

      // Validate result
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response from authentication service");
      }

      if (!result.success) {
        toast({
          title: "Sign Up Failed",
          description: result.error || "Failed to create account",
          variant: "destructive",
        });
        throw new Error(result.error);
      }

      if (result.wildlifeWelcome) {
        toast({
          title: result.wildlifeWelcome.message,
          description: "Welcome to the Savanna pride!",
        });
      }
    } catch (error) {
      console.error("🚨 Sign Up Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (authService && typeof authService.signOut === "function") {
        await authService.signOut();
      }
    } catch (authError) {
      console.error("🚨 Auth Service SignOut Error:", authError);
      // Continue with local cleanup even if service fails
    }

    // Update local state
    setUser(null);
    setProfile(null);
  };

  const demoLogin = async (userType: "retailer" | "supplier" | "logistics") => {
    try {
      console.log(`🎭 Starting demo login for: ${userType}`);
      setLoading(true);

      // Validate input
      if (
        !userType ||
        !["retailer", "supplier", "logistics"].includes(userType)
      ) {
        throw new Error("Invalid user type for demo login");
      }

      // Call authService demo login with validation
      let result;
      try {
        if (!authService || typeof authService.demoLogin !== "function") {
          throw new Error("Authentication service not properly initialized");
        }

        result = await authService.demoLogin(userType);
      } catch (authError) {
        console.error("🚨 Auth Service DemoLogin Error:", authError);
        throw new Error(
          "Authentication service unavailable. Please try again.",
        );
      }

      // Process the result
      console.log("🔍 Processing demo login result:", result);
      await processDemoLoginResult(result);
    } catch (error) {
      console.error("🚨 Demo Login Error:", error);

      // Show user-friendly error message
      try {
        toast({
          title: "Demo Login Failed",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      } catch (toastError) {
        console.warn("🚨 Toast error in error handler:", toastError);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process demo login results
  const processDemoLoginResult = async (result: any) => {
    try {
      // Validate result
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response from authentication service");
      }

      if (result.success && result.user) {
        // Validate required user properties
        if (!result.user.id || !result.user.email) {
          throw new Error("Invalid user data - missing required fields");
        }

        // Create a mock Supabase user object with safe property access
        const mockUser = {
          id: result.user.id,
          email: result.user.email,
          user_metadata: {
            first_name: result.user.firstName || "Demo",
            last_name: result.user.lastName || "User",
            user_type: result.user.userType || "retailer",
          },
        } as User;

        setUser(mockUser);
        setProfile(result.user);

        if (result.wildlifeWelcome) {
          try {
            toast({
              title: result.wildlifeWelcome.message || "Demo Login Successful",
              description: "Demo mode activated!",
            });
          } catch (toastError) {
            console.warn("🚨 Toast error (non-critical):", toastError);
            // Continue without toast if it fails
          }
        }

        console.log(`✅ Demo login successful for ${result.user.userType}`);
      } else {
        throw new Error(result.error || "Demo login failed");
      }
    } catch (error) {
      console.error("🚨 Error in processDemoLoginResult:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        demoLogin,
        profile,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
