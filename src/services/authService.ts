/**
 * 🦁 Savanna Marketplace - Authentication Service
 * Wildlife-themed auth system with Kenya-specific features
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: string;
  userType: "retailer" | "supplier" | "logistics" | "admin";
  verificationLevel: "basic" | "verified" | "premium";
  kycStatus: "pending" | "approved" | "rejected";
  location: {
    county: string;
    town: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  mpesaPhone?: string;
  creditScore?: number;
  joinedDate: Date;
  lastLoginDate?: Date;
  isActive: boolean;
  preferences: {
    language: "en" | "sw";
    notifications: boolean;
    ussdMode: boolean;
    currency: "KES" | "USD";
  };
  wildlifeProfile: {
    tier: "lion" | "elephant" | "rhino" | "cheetah" | "gazelle";
    points: number;
    achievements: string[];
    preferredAnimal: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  sessionToken?: string;
  wildlifeWelcome?: {
    icon: string;
    message: string;
    sound: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  businessName?: string;
  businessType?: string;
  userType: "retailer" | "supplier" | "logistics";
  location: {
    county: string;
    town: string;
  };
  mpesaPhone?: string;
  referredBy?: string;
}

class AuthService {
  private currentUser: UserProfile | null = null;
  private sessionToken: string | null = null;
  private authListeners: ((user: UserProfile | null) => void)[] = [];

  /**
   * 🦁 Sign up new user with wildlife onboarding
   */
  public async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      // Validate Kenya phone number
      if (!this.validateKenyaPhone(userData.phone)) {
        return {
          success: false,
          error: "Please enter a valid Kenyan phone number (+254...)",
        };
      }

      // Check if user already exists
      const existingUser = await this.checkUserExists(
        userData.email,
        userData.phone,
      );
      if (existingUser) {
        return {
          success: false,
          error: "User already exists with this email or phone number",
        };
      }

      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            user_type: userData.userType,
          },
        },
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: "Failed to create user account",
        };
      }

      // Create user profile
      const userProfile = await this.createUserProfile(
        authData.user.id,
        userData,
      );

      // Generate wildlife welcome
      const wildlifeWelcome = this.generateWildlifeWelcome(userProfile);

      // Log successful signup
      console.log("🦁 New user joined the pride:", userProfile.email);

      return {
        success: true,
        user: userProfile,
        wildlifeWelcome,
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.message || "Failed to create account",
      };
    }
  }

  /**
   * 🏠 Sign in existing user
   */
  public async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Attempt Supabase sign in
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        // Track failed login attempt
        this.trackFailedLogin(email);

        return {
          success: false,
          error: this.getFriendlyErrorMessage(authError.message),
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      // Get user profile or create a basic one
      let userProfile = await this.getUserProfile(authData.user.id);
      if (!userProfile) {
        // Create a basic profile for users without one (e.g., admin users)
        userProfile = await this.createBasicProfile(authData.user);
        if (!userProfile) {
          return {
            success: false,
            error: "Could not access user profile",
          };
        }
      }

      // Update last login
      await this.updateLastLogin(userProfile.id);

      // Set current user
      this.currentUser = userProfile;
      this.sessionToken = authData.session?.access_token || null;

      // Store in localStorage for persistence
      localStorage.setItem("savanna_user", JSON.stringify(userProfile));
      localStorage.setItem(
        "savanna_session",
        authData.session?.access_token || "",
      );

      // Notify listeners
      this.notifyAuthListeners(userProfile);

      // Generate welcome back message
      const wildlifeWelcome = this.generateWelcomeBackMessage(userProfile);

      // Log successful login
      console.log("🦁 User returned to the pride:", userProfile.email);

      return {
        success: true,
        user: userProfile,
        sessionToken: authData.session?.access_token,
        wildlifeWelcome,
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Failed to sign in",
      };
    }
  }

  /**
   * 🌅 Sign out user with sunset animation
   */
  public async signOut(): Promise<void> {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Signout error:", error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Clear local data
      this.currentUser = null;
      this.sessionToken = null;
      localStorage.removeItem("savanna_user");
      localStorage.removeItem("savanna_session");
      localStorage.removeItem("savanna_cart"); // Clear cart on logout

      // Notify listeners
      this.notifyAuthListeners(null);

      // Show wildlife farewell
      toast({
        title: "🌅 Until next sunrise!",
        description: "You've been safely signed out of the pride.",
      });

      console.log("🌅 User left the pride - successful logout");
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  }

  /**
   * 🔄 Initialize auth state from storage
   */
  public async initializeAuth(): Promise<UserProfile | null> {
    try {
      // Check Supabase session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session check error:", error);
        return null;
      }

      if (session?.user) {
        // Get user profile
        const userProfile = await this.getUserProfile(session.user.id);
        if (userProfile) {
          this.currentUser = userProfile;
          this.sessionToken = session.access_token;

          // Update localStorage
          localStorage.setItem("savanna_user", JSON.stringify(userProfile));
          localStorage.setItem("savanna_session", session.access_token);

          console.log("🦁 User session restored:", userProfile.email);
          return userProfile;
        }
      }

      // Try localStorage fallback
      const storedUser = localStorage.getItem("savanna_user");
      const storedSession = localStorage.getItem("savanna_session");

      if (storedUser && storedSession) {
        const userProfile = JSON.parse(storedUser) as UserProfile;
        this.currentUser = userProfile;
        this.sessionToken = storedSession;

        console.log(
          "🦁 User session restored from storage:",
          userProfile.email,
        );
        return userProfile;
      }

      return null;
    } catch (error) {
      console.error("Auth initialization error:", error);
      return null;
    }
  }

  /**
   * 👤 Get current user
   */
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  /**
   * 🎯 Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.sessionToken !== null;
  }

  /**
   * 👂 Add auth state listener
   */
  public addAuthListener(callback: (user: UserProfile | null) => void): void {
    this.authListeners.push(callback);
  }

  /**
   * 🚫 Remove auth state listener
   */
  public removeAuthListener(
    callback: (user: UserProfile | null) => void,
  ): void {
    this.authListeners = this.authListeners.filter(
      (listener) => listener !== callback,
    );
  }

  /**
   * 📱 Validate Kenya phone number
   */
  private validateKenyaPhone(phone: string): boolean {
    // Kenya phone numbers: +254 or 0 followed by 7/1 and 8 digits
    const kenyaPhoneRegex = /^(\+254|0)?[17]\d{8}$/;
    return kenyaPhoneRegex.test(phone.replace(/\s+/g, ""));
  }

  /**
   * 🔍 Check if user already exists
   */
  private async checkUserExists(
    email: string,
    phone: string,
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id")
        .or(`email.eq.${email},phone.eq.${phone}`)
        .limit(1);

      if (error) {
        console.error("User existence check error:", error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error("User existence check error:", error);
      return false;
    }
  }

  /**
   * 👤 Create user profile
   */
  private async createUserProfile(
    userId: string,
    userData: SignUpData,
  ): Promise<UserProfile> {
    const profile: UserProfile = {
      id: userId,
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      businessName: userData.businessName,
      businessType: userData.businessType,
      userType: userData.userType,
      verificationLevel: "basic",
      kycStatus: "pending",
      location: userData.location,
      mpesaPhone: userData.mpesaPhone || userData.phone,
      joinedDate: new Date(),
      isActive: true,
      preferences: {
        language: "en",
        notifications: true,
        ussdMode: false,
        currency: "KES",
      },
      wildlifeProfile: {
        tier: "lion", // All users start as lions
        points: 100, // Starting points
        achievements: ["Pride Member"],
        preferredAnimal: this.assignRandomAnimal(),
      },
    };

    // In production, save to database
    try {
      const { error } = await supabase.from("user_profiles").insert([
        {
          id: userId,
          email: profile.email,
          phone: profile.phone,
          first_name: profile.firstName,
          last_name: profile.lastName,
          business_name: profile.businessName,
          user_type: profile.userType,
          verification_level: profile.verificationLevel,
          kyc_status: profile.kycStatus,
          location: profile.location,
          preferences: profile.preferences,
          wildlife_profile: profile.wildlifeProfile,
          is_active: true,
          joined_date: profile.joinedDate.toISOString(),
        },
      ]);

      if (error) {
        console.error("Profile creation error:", error);
      }
    } catch (error) {
      console.error("Profile creation error:", error);
    }

    return profile;
  }

  /**
   * 🏗️ Create basic profile for users without one
   */
  private async createBasicProfile(user: any): Promise<UserProfile | null> {
    try {
      // Determine user type from email patterns
      let userType: "retailer" | "supplier" | "logistics" | "admin" =
        "retailer";
      if (user.email?.includes("admin@") || user.email?.includes("@admin.")) {
        userType = "admin";
      } else if (user.email?.includes("supplier@")) {
        userType = "supplier";
      } else if (user.email?.includes("logistics@")) {
        userType = "logistics";
      }

      // Create basic profile object
      const basicProfile: UserProfile = {
        id: user.id,
        email: user.email,
        phone: user.phone || "",
        firstName:
          user.user_metadata?.first_name || user.email?.split("@")[0] || "User",
        lastName: user.user_metadata?.last_name || "",
        businessName: user.user_metadata?.business_name,
        businessType: user.user_metadata?.business_type,
        userType: userType,
        verificationLevel: userType === "admin" ? "premium" : "basic",
        kycStatus: userType === "admin" ? "approved" : "pending",
        location: {
          county: "Nairobi",
          town: "Nairobi",
        },
        mpesaPhone: user.phone,
        creditScore: userType === "admin" ? 100 : 75,
        joinedDate: new Date(),
        lastLoginDate: new Date(),
        isActive: true,
        preferences: {
          language: "en",
          notifications: true,
          ussdMode: false,
          currency: "KES",
        },
        wildlifeProfile: {
          tier: userType === "admin" ? "lion" : "gazelle",
          points: userType === "admin" ? 1000 : 100,
          achievements:
            userType === "admin"
              ? ["Pride Leader", "Admin Access"]
              : ["New Member"],
          preferredAnimal: userType === "admin" ? "lion" : "gazelle",
        },
      };

      return basicProfile;
    } catch (error) {
      console.error("Error creating basic profile:", error);
      return null;
    }
  }

  /**
   * 🔍 Get user profile from database
   */
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.error("Profile fetch error:", error);
        return null;
      }

      // Convert database format to UserProfile
      return {
        id: data.id,
        email: data.email,
        phone: data.phone,
        firstName: data.first_name,
        lastName: data.last_name,
        businessName: data.business_name,
        businessType: data.business_type,
        userType: data.user_type,
        verificationLevel: data.verification_level || "basic",
        kycStatus: data.kyc_status || "pending",
        location: data.location || { county: "Nairobi", town: "Nairobi" },
        mpesaPhone: data.mpesa_phone,
        creditScore: data.credit_score,
        joinedDate: new Date(data.joined_date),
        lastLoginDate: data.last_login_date
          ? new Date(data.last_login_date)
          : undefined,
        isActive: data.is_active,
        preferences: data.preferences || {
          language: "en",
          notifications: true,
          ussdMode: false,
          currency: "KES",
        },
        wildlifeProfile: data.wildlife_profile || {
          tier: "lion",
          points: 100,
          achievements: ["Pride Member"],
          preferredAnimal: "lion",
        },
      };
    } catch (error) {
      console.error("Profile fetch error:", error);
      return null;
    }
  }

  /**
   * 🔄 Update last login timestamp
   */
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from("user_profiles")
        .update({
          last_login_date: new Date().toISOString(),
        })
        .eq("id", userId);
    } catch (error) {
      console.error("Last login update error:", error);
    }
  }

  /**
   * 🚨 Track failed login attempt
   */
  private trackFailedLogin(email: string): void {
    console.log(`⚠️ Failed login attempt for: ${email}`);
    // In production, implement rate limiting and security measures
  }

  /**
   * 💬 Get friendly error message
   */
  private getFriendlyErrorMessage(error: string): string {
    const errorMap: { [key: string]: string } = {
      "Invalid login credentials":
        "🦁 These credentials don't match our pride records",
      "Email not confirmed":
        "📧 Please check your email and confirm your account",
      "Too many requests":
        "⏰ Too many attempts. Please wait a moment before trying again",
      "User not found": "🔍 No account found with these details",
    };

    return errorMap[error] || `🚨 ${error}`;
  }

  /**
   * 🎊 Generate wildlife welcome message
   */
  private generateWildlifeWelcome(user: UserProfile): any {
    const welcomeMessages = {
      retailer: {
        icon: "🛒",
        message: `Welcome to the pride, ${user.firstName}! Your shop is now part of the savanna ecosystem.`,
        sound: "lion_roar",
      },
      supplier: {
        icon: "🏭",
        message: `Welcome, ${user.firstName}! Your products will feed the entire savanna.`,
        sound: "elephant_trumpet",
      },
      logistics: {
        icon: "🚛",
        message: `Welcome, ${user.firstName}! You're the cheetah that keeps the savanna moving.`,
        sound: "cheetah_chirp",
      },
    };

    return welcomeMessages[user.userType] || welcomeMessages.retailer;
  }

  /**
   * 🏠 Generate welcome back message
   */
  private generateWelcomeBackMessage(user: UserProfile): any {
    const messages = [
      {
        icon: "🦁",
        message: `Welcome back to the pride, ${user.firstName}!`,
        sound: "gentle_roar",
      },
      {
        icon: "🌅",
        message: `The savanna awakens with your return, ${user.firstName}!`,
        sound: "bird_chirp",
      },
      {
        icon: "🌿",
        message: `The acacia trees missed you, ${user.firstName}!`,
        sound: "wind_rustle",
      },
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * 🦁 Assign random animal avatar
   */
  private assignRandomAnimal(): string {
    const animals = ["🦁", "🐘", "🦏", "🐆", "🦓", "🦌", "🐃", "🦒"];
    return animals[Math.floor(Math.random() * animals.length)];
  }

  /**
   * 📢 Notify auth listeners
   */
  private notifyAuthListeners(user: UserProfile | null): void {
    this.authListeners.forEach((callback) => {
      try {
        callback(user);
      } catch (error) {
        console.error("Auth listener error:", error);
      }
    });
  }

  /**
   * 🔐 Demo login for testing
   */
  public async demoLogin(
    userType: "retailer" | "supplier" | "logistics",
  ): Promise<AuthResponse> {
    const demoProfiles: { [key: string]: UserProfile } = {
      retailer: {
        id: "demo-retailer-001",
        email: "demo.retailer@savanna.co.ke",
        phone: "+254712345678",
        firstName: "Mary",
        lastName: "Wanjiku",
        businessName: "Wanjiku General Store",
        businessType: "grocery_store",
        userType: "retailer",
        verificationLevel: "verified",
        kycStatus: "approved",
        location: { county: "Nairobi", town: "Westlands" },
        mpesaPhone: "+254712345678",
        creditScore: 750,
        joinedDate: new Date("2024-01-15"),
        lastLoginDate: new Date(),
        isActive: true,
        preferences: {
          language: "en",
          notifications: true,
          ussdMode: false,
          currency: "KES",
        },
        wildlifeProfile: {
          tier: "elephant",
          points: 2500,
          achievements: ["Pride Member", "Loyal Customer", "Group Buyer"],
          preferredAnimal: "🐘",
        },
      },
      supplier: {
        id: "demo-supplier-001",
        email: "demo.supplier@savanna.co.ke",
        phone: "+254723456789",
        firstName: "James",
        lastName: "Kiprotich",
        businessName: "Kiprotich Distributors",
        businessType: "distributor",
        userType: "supplier",
        verificationLevel: "premium",
        kycStatus: "approved",
        location: { county: "Nakuru", town: "Nakuru" },
        mpesaPhone: "+254723456789",
        creditScore: 850,
        joinedDate: new Date("2023-08-10"),
        lastLoginDate: new Date(),
        isActive: true,
        preferences: {
          language: "en",
          notifications: true,
          ussdMode: false,
          currency: "KES",
        },
        wildlifeProfile: {
          tier: "rhino",
          points: 4200,
          achievements: ["Pride Member", "Trusted Supplier", "Volume Leader"],
          preferredAnimal: "🦏",
        },
      },
      logistics: {
        id: "demo-logistics-001",
        email: "demo.logistics@savanna.co.ke",
        phone: "+254734567890",
        firstName: "Grace",
        lastName: "Njeri",
        businessName: "Njeri Express",
        businessType: "logistics",
        userType: "logistics",
        verificationLevel: "verified",
        kycStatus: "approved",
        location: { county: "Kiambu", town: "Thika" },
        mpesaPhone: "+254734567890",
        creditScore: 680,
        joinedDate: new Date("2024-03-20"),
        lastLoginDate: new Date(),
        isActive: true,
        preferences: {
          language: "sw",
          notifications: true,
          ussdMode: true,
          currency: "KES",
        },
        wildlifeProfile: {
          tier: "cheetah",
          points: 1800,
          achievements: ["Pride Member", "Speed Demon", "Route Master"],
          preferredAnimal: "🐆",
        },
      },
    };

    const demoUser = demoProfiles[userType];

    // Set current user
    this.currentUser = demoUser;
    this.sessionToken = "demo-session-token";

    // Store in localStorage
    localStorage.setItem("savanna_user", JSON.stringify(demoUser));
    localStorage.setItem("savanna_session", "demo-session-token");

    // Notify listeners
    this.notifyAuthListeners(demoUser);

    const wildlifeWelcome = this.generateWelcomeBackMessage(demoUser);

    console.log(`🎭 Demo login successful for ${userType}:`, demoUser.email);

    return {
      success: true,
      user: demoUser,
      sessionToken: "demo-session-token",
      wildlifeWelcome,
    };
  }
}

// Singleton instance
export const authService = new AuthService();
export default authService;
