import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { useSwahiliVoice } from "@/hooks/useSwahiliVoice";
import VoiceCommandOverlay from "@/components/performance/VoiceCommandOverlay";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const NeoSavannahIndex = lazy(() => import("@/pages/NeoSavannahIndex"));
const Products = lazy(() => import("@/pages/Products"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Cart = lazy(() => import("@/pages/Cart"));
const Auth = lazy(() => import("@/pages/Auth"));
const AfricanHeritage = lazy(() => import("@/pages/AfricanHeritage"));
const OpenMarket = lazy(() => import("@/pages/OpenMarket"));

// Pricing and Onboarding
const PricingOnboarding = lazy(() => import("@/pages/PricingOnboarding"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const EcosystemExpansion = lazy(() => import("@/pages/EcosystemExpansion"));

// Additional Core Pages
const Features = lazy(() => import("@/pages/Features"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Support = lazy(() => import("@/pages/Support"));
const Innovation = lazy(() => import("@/pages/Innovation"));

// User Profile & Settings
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Orders = lazy(() => import("@/pages/Orders"));

// Legal Pages
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const DataProtection = lazy(() => import("@/pages/legal/DataProtection"));
const FraudReporting = lazy(() => import("@/pages/legal/FraudReporting"));
const SupplierAgreements = lazy(
  () => import("@/pages/legal/SupplierAgreements"),
);

// Help System
const USSDGuide = lazy(() => import("@/pages/help/USSDGuide"));

// Innovative Marketplace Features
const GroupBuying = lazy(() => import("@/pages/GroupBuying"));
const ChamaDAOs = lazy(() => import("@/pages/ChamaDAOs"));
const MpesaGoats = lazy(() => import("@/pages/MpesaGoats"));
const MatatuMesh = lazy(() => import("@/pages/MatatuMesh"));
const MaasaiMerit = lazy(() => import("@/pages/MaasaiMerit"));
const HarambeeProcurement = lazy(() => import("@/pages/HarambeeProcurement"));
const RefugeeMarkets = lazy(() => import("@/pages/RefugeeMarkets"));
const OralContracts = lazy(() => import("@/pages/OralContracts"));

// Enterprise pages
const WateringHoles = lazy(() => import("@/pages/enterprise/WateringHoles"));
const HerdDirectory = lazy(() => import("@/pages/enterprise/HerdDirectory"));
const SwiftRetailers = lazy(() => import("@/pages/enterprise/SwiftRetailers"));
const PackStories = lazy(() => import("@/pages/enterprise/PackStories"));

// Dashboard pages
const EnhancedSupplierHub = lazy(
  () => import("@/pages/dashboard/supplier/EnhancedSupplierHub"),
);
const CheetahLogistics = lazy(
  () => import("@/pages/dashboard/logistics/CheetahLogistics"),
);

// Admin pages
const AfricanHeritageAdmin = lazy(
  () => import("@/pages/admin/AfricanHeritageAdmin"),
);

// Voice Command Integration
const VoiceEnabledApp: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const voice = useSwahiliVoice();
  const [showVoiceOverlay, setShowVoiceOverlay] = React.useState(false);

  // Add voice button to UI
  React.useEffect(() => {
    if (voice.isSupported) {
      const voiceButton = document.createElement("button");
      voiceButton.innerHTML = voice.isListening ? "🎤 ON" : "🎤 OFF";
      voiceButton.className = "voice-toggle-button";
      voiceButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${voice.isListening ? "#4CAF50" : "#FF6B35"};
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 0.8rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        display: ${voice.config.enableVoiceCommands ? "flex" : "none"};
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      `;

      voiceButton.onclick = () => {
        if (voice.isListening) {
          voice.stopListening();
        } else {
          voice.startListening();
        }
      };

      voiceButton.oncontextmenu = (e) => {
        e.preventDefault();
        setShowVoiceOverlay(true);
      };

      document.body.appendChild(voiceButton);

      return () => {
        if (document.body.contains(voiceButton)) {
          document.body.removeChild(voiceButton);
        }
      };
    }
  }, [voice.isListening, voice.isSupported, voice.config.enableVoiceCommands]);

  return (
    <>
      {children}
      <VoiceCommandOverlay
        show={showVoiceOverlay}
        onClose={() => setShowVoiceOverlay(false)}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <Router>
          <CartProvider>
            <VoiceEnabledApp>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading...</p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    {/* Main Pages */}
                    <Route path="/" element={<Index />} />
                    <Route
                      path="/neo-savannah"
                      element={<NeoSavannahIndex />}
                    />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Pricing and Onboarding Flow */}
                    <Route path="/pricing" element={<PricingOnboarding />} />
                    <Route path="/onboarding" element={<Onboarding />} />

                    {/* Ecosystem Expansion */}
                    <Route
                      path="/ecosystem-expansion"
                      element={<EcosystemExpansion />}
                    />

                    {/* Additional Core Pages */}
                    <Route path="/features" element={<Features />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/innovation" element={<Innovation />} />

                    {/* Legal Pages */}
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route
                      path="/legal/data-protection"
                      element={<DataProtection />}
                    />
                    <Route
                      path="/legal/fraud-reporting"
                      element={<FraudReporting />}
                    />
                    <Route
                      path="/legal/supplier-agreements"
                      element={<SupplierAgreements />}
                    />

                    {/* Help System */}
                    <Route path="/help/ussd-guide" element={<USSDGuide />} />

                    {/* New Platform Features */}
                    <Route
                      path="/african-heritage"
                      element={<AfricanHeritage />}
                    />
                    <Route path="/open-market" element={<OpenMarket />} />

                    {/* Innovative Marketplace Features */}
                    <Route path="/group-buying" element={<GroupBuying />} />
                    <Route path="/chama-daos" element={<ChamaDAOs />} />
                    <Route path="/mpesa-goats" element={<MpesaGoats />} />
                    <Route path="/matatu-mesh" element={<MatatuMesh />} />
                    <Route path="/maasai-merit" element={<MaasaiMerit />} />
                    <Route
                      path="/harambee-procurement"
                      element={<HarambeeProcurement />}
                    />
                    <Route
                      path="/refugee-markets"
                      element={<RefugeeMarkets />}
                    />
                    <Route path="/oral-contracts" element={<OralContracts />} />

                    {/* User Profile & Settings */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/orders" element={<Orders />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/dashboard/supplier/enhanced"
                      element={<EnhancedSupplierHub />}
                    />
                    <Route
                      path="/dashboard/logistics"
                      element={<CheetahLogistics />}
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/african-heritage"
                      element={<AfricanHeritageAdmin />}
                    />

                    {/* Enterprise Ecosystem */}
                    <Route path="/watering-holes" element={<WateringHoles />} />
                    <Route path="/herd-directory" element={<HerdDirectory />} />
                    <Route
                      path="/swift-retailers"
                      element={<SwiftRetailers />}
                    />
                    <Route path="/pack-stories" element={<PackStories />} />

                    {/* Fallback route */}
                    <Route path="*" element={<Index />} />
                  </Routes>
                </Suspense>

                <Toaster />
              </div>
            </VoiceEnabledApp>
          </CartProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
