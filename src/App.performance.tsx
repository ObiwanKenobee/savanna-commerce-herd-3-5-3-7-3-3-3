/**
 * 🦁 Enhanced App Component with Performance Optimizations
 * This is an example of how to integrate the PerformanceProvider
 */

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
// Performance provider - commented out to prevent errors
// import PerformanceProvider from "@/components/performance/PerformanceProvider";
// import { ProductGridSkeleton } from "@/components/wildlife/WildlifeSkeletons";
import { useSwahiliVoice } from "@/hooks/useSwahiliVoice";
import VoiceCommandOverlay from "@/components/performance/VoiceCommandOverlay";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const Products = lazy(() => import("@/pages/Products"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Cart = lazy(() => import("@/pages/Cart"));
const Auth = lazy(() => import("@/pages/Auth"));
const WateringHoles = lazy(() => import("@/pages/enterprise/WateringHoles"));
const HerdDirectory = lazy(() => import("@/pages/enterprise/HerdDirectory"));
const SwiftRetailers = lazy(() => import("@/pages/enterprise/SwiftRetailers"));
const PackStories = lazy(() => import("@/pages/enterprise/PackStories"));
const EnhancedSupplierHub = lazy(
  () => import("@/pages/dashboard/supplier/EnhancedSupplierHub"),
);
const CheetahLogistics = lazy(
  () => import("@/pages/dashboard/logistics/CheetahLogistics"),
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
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth" element={<Auth />} />

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

                {/* Enterprise Ecosystem */}
                <Route path="/watering-holes" element={<WateringHoles />} />
                <Route path="/herd-directory" element={<HerdDirectory />} />
                <Route path="/swift-retailers" element={<SwiftRetailers />} />
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
  );
}

export default App;
