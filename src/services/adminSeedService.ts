import { supabase } from "@/integrations/supabase/client";

export interface AdminCredentials {
  email: string;
  password: string;
  role: "admin" | "super_admin";
  metadata: {
    full_name: string;
    user_type: string;
    department: string;
    permissions: string[];
    pride_level: string;
    animal_metaphor: string;
  };
}

// Seeded admin credentials for development and demo
export const ADMIN_CREDENTIALS: AdminCredentials[] = [
  {
    email: "lion@savannah.co.ke",
    password: "Pride2024!Lion",
    role: "super_admin",
    metadata: {
      full_name: "Simba Mfalme",
      user_type: "admin",
      department: "Pride Leadership",
      permissions: [
        "full_platform_access",
        "user_management",
        "system_configuration",
        "financial_oversight",
        "ecosystem_governance",
        "innovation_lab",
      ],
      pride_level: "Pride Leader",
      animal_metaphor: "🦁 Lion King",
    },
  },
  {
    email: "admin@savannah.co.ke",
    password: "Savannah2024!Admin",
    role: "admin",
    metadata: {
      full_name: "Nala Tembo",
      user_type: "admin",
      department: "Platform Operations",
      permissions: [
        "enterprise_management",
        "analytics_access",
        "user_support",
        "content_moderation",
        "marketplace_governance",
      ],
      pride_level: "Senior Pride Member",
      animal_metaphor: "🦁 Lioness Guardian",
    },
  },
  {
    email: "tech@savannah.co.ke",
    password: "Innovation2024!Tech",
    role: "admin",
    metadata: {
      full_name: "Kesi Teknolojia",
      user_type: "admin",
      department: "Innovation Lab",
      permissions: [
        "system_development",
        "ai_model_management",
        "blockchain_operations",
        "ar_vr_features",
        "voice_gesture_systems",
      ],
      pride_level: "Tech Pride Leader",
      animal_metaphor: "🦏 Tech Rhino",
    },
  },
];

class AdminSeedService {
  async seedAdminCredentials(): Promise<boolean> {
    try {
      console.log("🌱 Starting admin credentials seeding...");

      for (const admin of ADMIN_CREDENTIALS) {
        try {
          // Check if admin already exists
          const { data: existingUser } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", admin.email)
            .single();

          if (existingUser) {
            console.log(`��� Admin ${admin.email} already exists, skipping...`);
            continue;
          }

          // Create admin account
          const { data: authData, error: authError } =
            await supabase.auth.signUp({
              email: admin.email,
              password: admin.password,
              options: {
                data: admin.metadata,
              },
            });

          if (authError) {
            console.error(`❌ Failed to create ${admin.email}:`, authError);
            continue;
          }

          // Create admin profile
          if (authData.user) {
            const { error: profileError } = await supabase
              .from("profiles")
              .insert({
                id: authData.user.id,
                email: admin.email,
                full_name: admin.metadata.full_name,
                user_type: admin.metadata.user_type,
                role: admin.role,
                department: admin.metadata.department,
                permissions: admin.metadata.permissions,
                pride_level: admin.metadata.pride_level,
                animal_metaphor: admin.metadata.animal_metaphor,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (profileError) {
              console.error(
                `❌ Failed to create profile for ${admin.email}:`,
                profileError,
              );
            } else {
              console.log(`✅ Successfully created admin: ${admin.email}`);
            }
          }
        } catch (error) {
          console.error(`❌ Error processing ${admin.email}:`, error);
        }
      }

      console.log("🎉 Admin seeding completed!");
      return true;
    } catch (error) {
      console.error("❌ Admin seeding failed:", error);
      return false;
    }
  }

  async validateAdminAccess(email: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type, role, permissions")
        .eq("email", email)
        .single();

      return (
        profile?.user_type === "admin" ||
        profile?.role === "admin" ||
        profile?.role === "super_admin"
      );
    } catch (error) {
      console.error("❌ Admin validation failed:", error);
      return false;
    }
  }

  getAdminCredentials(): AdminCredentials[] {
    return ADMIN_CREDENTIALS;
  }

  // Quick login helper for development
  async quickAdminLogin(
    role: "super_admin" | "admin" | "tech" = "admin",
  ): Promise<boolean> {
    try {
      const adminMap = {
        super_admin: ADMIN_CREDENTIALS[0],
        admin: ADMIN_CREDENTIALS[1],
        tech: ADMIN_CREDENTIALS[2],
      };

      const credentials = adminMap[role];

      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("❌ Quick admin login failed:", error);
        return false;
      }

      console.log(
        `✅ Logged in as ${credentials.metadata.full_name} (${credentials.metadata.animal_metaphor})`,
      );
      return true;
    } catch (error) {
      console.error("❌ Quick admin login error:", error);
      return false;
    }
  }
}

export const adminSeedService = new AdminSeedService();
export default adminSeedService;
