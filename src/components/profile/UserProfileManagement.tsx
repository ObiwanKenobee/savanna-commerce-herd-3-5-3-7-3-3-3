import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Settings,
  Camera,
  Save,
  Check,
  X,
  Award,
  Star,
  Truck,
  DollarSign,
} from "lucide-react";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  organization: {
    name: string;
    type: string;
    industry: string;
    country: string;
    region: string;
    description: string;
    website: string;
    yearEstablished: string;
    employeeCount: string;
    annualRevenue: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      marketing: boolean;
    };
    privacy: {
      profileVisible: boolean;
      contactInfoVisible: boolean;
      businessDetailsVisible: boolean;
    };
  };
  verification: {
    email: boolean;
    phone: boolean;
    business: boolean;
    identity: boolean;
  };
}

export const UserProfileManagement = () => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    role: profile?.role || "buyer",
    organization: {
      name: profile?.organization?.name || "",
      type: profile?.organization?.organization_type || "",
      industry: profile?.organization?.industry || "",
      country: profile?.organization?.country || "",
      region: profile?.organization?.region || "",
      description: "",
      website: "",
      yearEstablished: "",
      employeeCount: profile?.organization?.employee_count?.toString() || "",
      annualRevenue: profile?.organization?.annual_revenue?.toString() || "",
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false,
      },
      privacy: {
        profileVisible: true,
        contactInfoVisible: false,
        businessDetailsVisible: true,
      },
    },
    verification: {
      email: user?.email_confirmed_at ? true : false,
      phone: false,
      business: profile?.organization?.verification_status === "verified",
      identity: false,
    },
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // TODO: Implement API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerification = (type: string) => {
    toast({
      title: "Verification Started",
      description: `${type} verification process has been initiated.`,
    });
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please sign in to access your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {profileData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                onClick={() => {
                  /* Handle avatar upload */
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
                  <p className="text-muted-foreground">
                    {profileData.organization.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{profileData.role}</Badge>
                    <Badge variant="outline">
                      {profileData.organization.country}
                    </Badge>
                    {profileData.verification.business && (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  disabled={isSaving}
                  variant={isEditing ? "default" : "outline"}
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              {/* Verification Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  {profileData.verification.email ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Email Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  {profileData.verification.phone ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Phone Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  {profileData.verification.business ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">Business Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  {profileData.verification.identity ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">ID Verified</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={profileData.role}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({ ...prev, role: value }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Information */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={profileData.organization.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: {
                          ...prev.organization,
                          name: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="organizationType">Organization Type</Label>
                  <Select
                    value={profileData.organization.type}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: { ...prev.organization, type: value },
                      }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole_proprietorship">
                        Sole Proprietorship
                      </SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={profileData.organization.industry}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: { ...prev.organization, industry: value },
                      }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="fisheries">Fisheries</SelectItem>
                      <SelectItem value="food_processing">
                        Food Processing
                      </SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={profileData.organization.country}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: { ...prev.organization, country: value },
                      }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Rwanda">Rwanda</SelectItem>
                      <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="region">Region/State</Label>
                  <Input
                    id="region"
                    value={profileData.organization.region}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: {
                          ...prev.organization,
                          region: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={profileData.organization.website}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: {
                          ...prev.organization,
                          website: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={profileData.organization.yearEstablished}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: {
                          ...prev.organization,
                          yearEstablished: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <Select
                    value={profileData.organization.employeeCount}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        organization: {
                          ...prev.organization,
                          employeeCount: value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-50">11-50</SelectItem>
                      <SelectItem value="51-200">51-200</SelectItem>
                      <SelectItem value="201-500">201-500</SelectItem>
                      <SelectItem value="500+">500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your business, products, and services..."
                  value={profileData.organization.description}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      organization: {
                        ...prev.organization,
                        description: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification */}
        <TabsContent value="verification">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Email Verification</p>
                          <p className="text-sm text-muted-foreground">
                            Verify your email address
                          </p>
                        </div>
                      </div>
                      {profileData.verification.email ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleVerification("Email")}
                        >
                          Verify
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Phone Verification</p>
                          <p className="text-sm text-muted-foreground">
                            Verify your phone number
                          </p>
                        </div>
                      </div>
                      {profileData.verification.phone ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleVerification("Phone")}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Business Verification</p>
                          <p className="text-sm text-muted-foreground">
                            Verify your business registration
                          </p>
                        </div>
                      </div>
                      {profileData.verification.business ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleVerification("Business")}
                        >
                          Verify
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Identity Verification</p>
                          <p className="text-sm text-muted-foreground">
                            Verify your identity document
                          </p>
                        </div>
                      </div>
                      {profileData.verification.identity ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleVerification("Identity")}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive order updates and important announcements
                      </p>
                    </div>
                    <Switch
                      checked={profileData.preferences.notifications.email}
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: {
                              ...prev.preferences.notifications,
                              email: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive critical updates via SMS
                      </p>
                    </div>
                    <Switch
                      checked={profileData.preferences.notifications.sms}
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: {
                              ...prev.preferences.notifications,
                              sms: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive real-time notifications in the app
                      </p>
                    </div>
                    <Switch
                      checked={profileData.preferences.notifications.push}
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: {
                              ...prev.preferences.notifications,
                              push: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional offers and newsletters
                      </p>
                    </div>
                    <Switch
                      checked={profileData.preferences.notifications.marketing}
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: {
                              ...prev.preferences.notifications,
                              marketing: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      checked={profileData.preferences.privacy.profileVisible}
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            privacy: {
                              ...prev.preferences.privacy,
                              profileVisible: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Contact Information</p>
                      <p className="text-sm text-muted-foreground">
                        Show contact details to verified users
                      </p>
                    </div>
                    <Switch
                      checked={
                        profileData.preferences.privacy.contactInfoVisible
                      }
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            privacy: {
                              ...prev.preferences.privacy,
                              contactInfoVisible: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Business Details</p>
                      <p className="text-sm text-muted-foreground">
                        Show business information in marketplace
                      </p>
                    </div>
                    <Switch
                      checked={
                        profileData.preferences.privacy.businessDetailsVisible
                      }
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            privacy: {
                              ...prev.preferences.privacy,
                              businessDetailsVisible: checked,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-muted-foreground">
                        View and manage your active login sessions
                      </p>
                    </div>
                    <Button variant="outline">Manage Sessions</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Download Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your account data
                      </p>
                    </div>
                    <Button variant="outline">Download Data</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg border-destructive">
                    <div>
                      <p className="font-medium text-destructive">
                        Delete Account
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
