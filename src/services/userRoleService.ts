import { supabase } from "../integrations/supabase/client";

export interface UserRole {
  id: string;
  name:
    | "admin"
    | "verified_supplier"
    | "aggregator"
    | "basic_supplier"
    | "maasai_artisan"
    | "refugee_entrepreneur"
    | "moderator";
  permissions: Permission[];
  verificationLevel: "basic" | "verified" | "certified";
  uploadLimits: {
    dailyProducts: number;
    maxProductValue: number;
    requiresApproval: boolean;
    bulkUploadAllowed: boolean;
  };
}

export interface Permission {
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
  conditions?: Record<string, any>;
}

export interface VerificationResult {
  canUpload: boolean;
  reason?: string;
  limitations?: string[];
  recommendations?: string[];
}

export interface SupplierOnboardingData {
  businessLicense?: File;
  phoneNumber: string;
  businessType: "individual" | "sme" | "cooperative" | "artisan" | "refugee";
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  mpesaNumber: string;
  specialVerification?: {
    type: "maasai_chief" | "unhcr_id" | "cooperative_cert";
    document: File;
    referenceNumber: string;
  };
}

export interface AggregatorData {
  cooperativeId: string;
  federationMembership: string;
  bulkUploadAPI: boolean;
  priceOverrideRights: boolean;
}

class UserRoleService {
  private readonly ROLE_DEFINITIONS: Record<string, UserRole> = {
    admin: {
      id: "admin",
      name: "admin",
      permissions: [
        { resource: "*", actions: ["create", "read", "update", "delete"] },
      ],
      verificationLevel: "certified",
      uploadLimits: {
        dailyProducts: Infinity,
        maxProductValue: Infinity,
        requiresApproval: false,
        bulkUploadAllowed: true,
      },
    },
    verified_supplier: {
      id: "verified_supplier",
      name: "verified_supplier",
      permissions: [
        { resource: "products", actions: ["create", "read", "update"] },
        { resource: "orders", actions: ["read", "update"] },
      ],
      verificationLevel: "verified",
      uploadLimits: {
        dailyProducts: 100,
        maxProductValue: 100000, // 100k KSh
        requiresApproval: false,
        bulkUploadAllowed: false,
      },
    },
    aggregator: {
      id: "aggregator",
      name: "aggregator",
      permissions: [
        {
          resource: "products",
          actions: ["create", "read", "update", "delete"],
        },
        { resource: "bulk_upload", actions: ["create"] },
        { resource: "price_override", actions: ["create"] },
      ],
      verificationLevel: "certified",
      uploadLimits: {
        dailyProducts: 1000,
        maxProductValue: 500000, // 500k KSh
        requiresApproval: false,
        bulkUploadAllowed: true,
      },
    },
    basic_supplier: {
      id: "basic_supplier",
      name: "basic_supplier",
      permissions: [{ resource: "products", actions: ["create", "read"] }],
      verificationLevel: "basic",
      uploadLimits: {
        dailyProducts: 5,
        maxProductValue: 10000, // 10k KSh
        requiresApproval: true,
        bulkUploadAllowed: false,
      },
    },
    maasai_artisan: {
      id: "maasai_artisan",
      name: "maasai_artisan",
      permissions: [
        { resource: "products", actions: ["create", "read", "update"] },
        { resource: "cultural_products", actions: ["create"] },
      ],
      verificationLevel: "verified",
      uploadLimits: {
        dailyProducts: 20,
        maxProductValue: 50000, // 50k KSh
        requiresApproval: false,
        bulkUploadAllowed: false,
      },
    },
    refugee_entrepreneur: {
      id: "refugee_entrepreneur",
      name: "refugee_entrepreneur",
      permissions: [
        { resource: "products", actions: ["create", "read", "update"] },
        { resource: "cash_payments", actions: ["create"] },
      ],
      verificationLevel: "verified",
      uploadLimits: {
        dailyProducts: 15,
        maxProductValue: 25000, // 25k KSh
        requiresApproval: false,
        bulkUploadAllowed: false,
      },
    },
    moderator: {
      id: "moderator",
      name: "moderator",
      permissions: [
        { resource: "moderation", actions: ["create", "read", "update"] },
        { resource: "products", actions: ["read", "update"] },
        { resource: "reports", actions: ["read", "update"] },
      ],
      verificationLevel: "certified",
      uploadLimits: {
        dailyProducts: 0,
        maxProductValue: 0,
        requiresApproval: false,
        bulkUploadAllowed: false,
      },
    },
  };

  async verifyUploadPermissions(userId: string): Promise<VerificationResult> {
    try {
      // Get user and their role
      const { data: user, error } = await supabase
        .from("users")
        .select(
          `
          *,
          user_roles(
            role_name,
            verification_level,
            granted_at
          )
        `,
        )
        .eq("id", userId)
        .single();

      if (error || !user) {
        return {
          canUpload: false,
          reason: "User not found or database error",
        };
      }

      // Get user's primary role (most recent or highest permission)
      const userRole = this.getPrimaryUserRole(user.user_roles);
      if (!userRole) {
        return {
          canUpload: false,
          reason: "No valid role assigned to user",
        };
      }

      const roleDefinition = this.ROLE_DEFINITIONS[userRole.role_name];
      if (!roleDefinition) {
        return {
          canUpload: false,
          reason: "Unknown role type",
        };
      }

      // Check if user has product creation permission
      const hasUploadPermission = roleDefinition.permissions.some(
        (permission) =>
          (permission.resource === "products" || permission.resource === "*") &&
          permission.actions.includes("create"),
      );

      if (!hasUploadPermission) {
        return {
          canUpload: false,
          reason: "User role does not have product upload permissions",
        };
      }

      // Check daily upload limits
      const todayUploads = await this.getTodayUploadCount(userId);
      if (todayUploads >= roleDefinition.uploadLimits.dailyProducts) {
        return {
          canUpload: false,
          reason: `Daily upload limit reached (${todayUploads}/${roleDefinition.uploadLimits.dailyProducts})`,
        };
      }

      // Additional checks for basic suppliers
      if (userRole.role_name === "basic_supplier") {
        const verificationChecks = await this.performBasicSupplierChecks(user);
        if (!verificationChecks.passed) {
          return {
            canUpload: false,
            reason: verificationChecks.reason,
            recommendations: verificationChecks.recommendations,
          };
        }
      }

      return {
        canUpload: true,
        limitations: this.getUploadLimitations(roleDefinition),
      };
    } catch (error) {
      console.error("Upload permission verification failed:", error);
      return {
        canUpload: false,
        reason: "System error during permission verification",
      };
    }
  }

  async verifyAggregatorPermissions(
    cooperativeId: string,
    apiKey: string,
  ): Promise<{ canBulkUpload: boolean; reason?: string }> {
    try {
      // Verify API key
      const { data: apiAuth, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("key_hash", apiKey)
        .eq("cooperative_id", cooperativeId)
        .eq("is_active", true)
        .single();

      if (error || !apiAuth) {
        return {
          canBulkUpload: false,
          reason: "Invalid API key or cooperative ID",
        };
      }

      // Check cooperative status
      const { data: cooperative, error: coopError } = await supabase
        .from("cooperatives")
        .select("*")
        .eq("id", cooperativeId)
        .eq("status", "verified")
        .single();

      if (coopError || !cooperative) {
        return {
          canBulkUpload: false,
          reason: "Cooperative not found or not verified",
        };
      }

      // Check bulk upload limits
      const todayUploads = await this.getTodayBulkUploadCount(cooperativeId);
      if (todayUploads >= 10) {
        // Max 10 bulk uploads per day
        return {
          canBulkUpload: false,
          reason: "Daily bulk upload limit reached",
        };
      }

      return { canBulkUpload: true };
    } catch (error) {
      console.error("Aggregator permission verification failed:", error);
      return {
        canBulkUpload: false,
        reason: "System error during verification",
      };
    }
  }

  async onboardSupplier(
    data: SupplierOnboardingData,
  ): Promise<{
    success: boolean;
    userId?: string;
    role?: string;
    errors?: string[];
  }> {
    try {
      const errors: string[] = [];

      // Validate phone number
      if (!this.isValidKenyanPhone(data.phoneNumber)) {
        errors.push("Invalid Kenyan phone number format");
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("phone", data.phoneNumber)
        .single();

      if (existingUser) {
        errors.push("User with this phone number already exists");
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      // Create user record
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          phone: data.phoneNumber,
          business_type: data.businessType,
          location_lat: data.location.lat,
          location_lng: data.location.lng,
          location_address: data.location.address,
          mpesa_number: data.mpesaNumber,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError || !newUser) {
        return { success: false, errors: ["Failed to create user account"] };
      }

      // Determine role based on business type and verification
      let roleName = "basic_supplier";
      let verificationLevel = "basic";

      if (data.specialVerification) {
        const verificationResult = await this.processSpecialVerification(
          newUser.id,
          data.specialVerification,
        );
        if (verificationResult.success) {
          roleName = verificationResult.roleName!;
          verificationLevel = verificationResult.verificationLevel!;
        }
      } else if (data.businessType === "cooperative") {
        roleName = "aggregator";
        verificationLevel = "verified";
      } else if (data.businessLicense) {
        // Process business license verification
        const licenseVerification = await this.verifyBusinessLicense(
          data.businessLicense,
        );
        if (licenseVerification.valid) {
          roleName = "verified_supplier";
          verificationLevel = "verified";
        }
      }

      // Assign role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: newUser.id,
        role_name: roleName,
        verification_level: verificationLevel,
        granted_by: "system",
        granted_at: new Date().toISOString(),
      });

      if (roleError) {
        console.error("Failed to assign role:", roleError);
        // Continue anyway, role can be assigned later
      }

      // Send welcome message
      await this.sendWelcomeMessage(data.phoneNumber, roleName);

      return {
        success: true,
        userId: newUser.id,
        role: roleName,
      };
    } catch (error) {
      console.error("Supplier onboarding failed:", error);
      return {
        success: false,
        errors: ["System error during onboarding"],
      };
    }
  }

  async upgradeUserRole(
    userId: string,
    newRole: string,
    moderatorId: string,
    reason: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate new role
      if (!this.ROLE_DEFINITIONS[newRole]) {
        return { success: false, error: "Invalid role type" };
      }

      // Check moderator permissions
      const moderatorCheck = await this.verifyModeratorPermissions(
        moderatorId,
        "role_management",
      );
      if (!moderatorCheck.hasPermission) {
        return { success: false, error: "Insufficient moderator permissions" };
      }

      // Update user role
      const { error } = await supabase
        .from("user_roles")
        .update({
          role_name: newRole,
          verification_level: this.ROLE_DEFINITIONS[newRole].verificationLevel,
          granted_by: moderatorId,
          granted_at: new Date().toISOString(),
          upgrade_reason: reason,
        })
        .eq("user_id", userId);

      if (error) {
        return { success: false, error: "Failed to update user role" };
      }

      // Log the role change
      await this.logRoleChange(userId, newRole, moderatorId, reason);

      // Notify user
      await this.notifyRoleUpgrade(userId, newRole);

      return { success: true };
    } catch (error) {
      console.error("Role upgrade failed:", error);
      return { success: false, error: "System error during role upgrade" };
    }
  }

  private getPrimaryUserRole(userRoles: any[]): any {
    if (!userRoles || userRoles.length === 0) {
      return null;
    }

    // Sort by verification level and grant date
    const sortedRoles = userRoles.sort((a, b) => {
      const levelOrder = { certified: 3, verified: 2, basic: 1 };
      const levelDiff =
        levelOrder[b.verification_level] - levelOrder[a.verification_level];
      if (levelDiff !== 0) return levelDiff;

      return (
        new Date(b.granted_at).getTime() - new Date(a.granted_at).getTime()
      );
    });

    return sortedRoles[0];
  }

  private async getTodayUploadCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("supplier_id", userId)
      .gte("created_at", today.toISOString());

    return data?.length || 0;
  }

  private async getTodayBulkUploadCount(
    cooperativeId: string,
  ): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("bulk_uploads")
      .select("id")
      .eq("cooperative_id", cooperativeId)
      .gte("created_at", today.toISOString());

    return data?.length || 0;
  }

  private async performBasicSupplierChecks(
    user: any,
  ): Promise<{ passed: boolean; reason?: string; recommendations?: string[] }> {
    const recommendations: string[] = [];

    // Check phone verification
    if (!user.phone_verified_at) {
      return {
        passed: false,
        reason: "Phone number not verified",
        recommendations: ["Verify phone via SMS code"],
      };
    }

    // Check M-Pesa verification (basic requirement)
    const mpesaCheck = await this.checkMPesaVerification(user.mpesa_number);
    if (!mpesaCheck.verified) {
      recommendations.push("Complete M-Pesa verification for higher limits");
    }

    // Check account age (at least 1 day old for basic uploads)
    const accountAge = Date.now() - new Date(user.created_at).getTime();
    if (accountAge < 24 * 60 * 60 * 1000) {
      // 24 hours
      return {
        passed: false,
        reason: "Account too new (must be at least 24 hours old)",
        recommendations: ["Wait 24 hours after registration before uploading"],
      };
    }

    return { passed: true, recommendations };
  }

  private getUploadLimitations(roleDefinition: UserRole): string[] {
    const limitations: string[] = [];

    if (roleDefinition.uploadLimits.dailyProducts < Infinity) {
      limitations.push(
        `Maximum ${roleDefinition.uploadLimits.dailyProducts} products per day`,
      );
    }

    if (roleDefinition.uploadLimits.maxProductValue < Infinity) {
      limitations.push(
        `Maximum product value: ${roleDefinition.uploadLimits.maxProductValue.toLocaleString()} KSh`,
      );
    }

    if (roleDefinition.uploadLimits.requiresApproval) {
      limitations.push("All uploads require manual approval");
    }

    if (!roleDefinition.uploadLimits.bulkUploadAllowed) {
      limitations.push("Bulk upload not available");
    }

    return limitations;
  }

  private async processSpecialVerification(
    userId: string,
    verification: any,
  ): Promise<{
    success: boolean;
    roleName?: string;
    verificationLevel?: string;
  }> {
    switch (verification.type) {
      case "maasai_chief":
        // Verify chief attestation
        return {
          success: true,
          roleName: "maasai_artisan",
          verificationLevel: "verified",
        };

      case "unhcr_id":
        // Verify UNHCR ID
        return {
          success: true,
          roleName: "refugee_entrepreneur",
          verificationLevel: "verified",
        };

      case "cooperative_cert":
        // Verify cooperative certification
        return {
          success: true,
          roleName: "aggregator",
          verificationLevel: "certified",
        };

      default:
        return { success: false };
    }
  }

  private async verifyBusinessLicense(
    license: File,
  ): Promise<{ valid: boolean; details?: any }> {
    // Mock business license verification
    // In production, integrate with government APIs or OCR services
    return { valid: true };
  }

  private async checkMPesaVerification(
    mpesaNumber: string,
  ): Promise<{ verified: boolean }> {
    // Mock M-Pesa verification check
    return { verified: true };
  }

  private isValidKenyanPhone(phone: string): boolean {
    const kenyanPhoneRegex = /^(\+254|254|0)([17][0-9]{8})$/;
    return kenyanPhoneRegex.test(phone);
  }

  private async verifyModeratorPermissions(
    moderatorId: string,
    action: string,
  ): Promise<{ hasPermission: boolean }> {
    const { data: moderator, error } = await supabase
      .from("user_roles")
      .select("role_name")
      .eq("user_id", moderatorId)
      .in("role_name", ["admin", "moderator"])
      .single();

    return { hasPermission: !error && !!moderator };
  }

  private async logRoleChange(
    userId: string,
    newRole: string,
    moderatorId: string,
    reason: string,
  ): Promise<void> {
    await supabase.from("role_change_logs").insert({
      user_id: userId,
      new_role: newRole,
      changed_by: moderatorId,
      reason: reason,
      created_at: new Date().toISOString(),
    });
  }

  private async notifyRoleUpgrade(
    userId: string,
    newRole: string,
  ): Promise<void> {
    // Send notification about role upgrade
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "role_upgrade",
      title: "Role Upgraded",
      message: `Your account has been upgraded to ${newRole.replace("_", " ")}`,
      created_at: new Date().toISOString(),
    });
  }

  private async sendWelcomeMessage(
    phoneNumber: string,
    roleName: string,
  ): Promise<void> {
    const roleMessages: Record<string, string> = {
      basic_supplier:
        "Karibu Savannah! Upload up to 5 products daily. Verify M-Pesa for more features.",
      verified_supplier:
        "Karibu Savannah! Your business is verified. Upload up to 100 products daily.",
      aggregator:
        "Karibu Savannah! Cooperative account ready. Bulk upload available.",
      maasai_artisan:
        "Karibu Savannah! Special artisan account created for cultural products.",
      refugee_entrepreneur:
        "Karibu Savannah! Entrepreneur account ready with cash payment options.",
    };

    const message = roleMessages[roleName] || "Karibu Savannah marketplace!";

    // Mock SMS sending
    console.log(`SMS to ${phoneNumber}: ${message}`);
  }
}

export const userRoleService = new UserRoleService();
