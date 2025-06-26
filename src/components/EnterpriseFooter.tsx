import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Shield,
  FileText,
  AlertTriangle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Smartphone,
  CreditCard,
  Globe,
  ChevronUp,
} from "lucide-react";

const EnterpriseFooter = () => {
  const [email, setEmail] = useState("");
  const [ussdMode, setUssdMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Newsletter signup
  const handleNewsletterSignup = () => {
    if (email.trim()) {
      console.log("📧 Newsletter signup:", email);
      setEmail("");
      // Show success notification
      alert("🦁 Welcome to the Herd! You'll receive savanna updates.");
    }
  };

  // Sound effects for interactions
  const playStampedeSound = () => {
    console.log("🦏 Playing gentle stampede sound");
  };

  // Kenya-specific emergency contacts
  const kenyaContacts = [
    { county: "Nairobi", phone: "020-SAVANNA", code: "020-7282662" },
    { county: "Mombasa", phone: "041-SAVANNA", code: "041-2228844" },
    { county: "Kisumu", phone: "057-SAVANNA", code: "057-2024477" },
    { county: "Nakuru", phone: "051-SAVANNA", code: "051-2212334" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-[#E2725B] to-[#CD5C5C] text-white">
      {/* Main Footer Content */}
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: The Savannah */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <h3 className="text-xl font-bold">The Savannah</h3>
            </div>

            <div className="space-y-3">
              <Link
                to="/open-market"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">🛒</span>
                <span>Open Market</span>
              </Link>

              <Link
                to="/group-buying"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">🤝</span>
                <span>Group Buying</span>
              </Link>

              <Link
                to="/herd-directory"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">🐘</span>
                <span>Herd Directory</span>
              </Link>

              <Link
                to="/watering-holes"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">🏞️</span>
                <span>Watering Holes</span>
              </Link>
            </div>

            {/* Kenya Business Hours */}
            <div className="pt-4 border-t border-orange-300/30">
              <div className="text-sm text-orange-200">
                <div className="font-semibold">🇰🇪 Business Hours (EAT)</div>
                <div>Mon-Fri: 6:00 AM - 10:00 PM</div>
                <div>Sat-Sun: 8:00 AM - 8:00 PM</div>
              </div>
            </div>
          </div>

          {/* Column 2: Waterhole Help */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💧</span>
              <h3 className="text-xl font-bold">Waterhole Help</h3>
            </div>

            <div className="space-y-3">
              <Link
                to="/help/ussd-guide"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Smartphone className="h-4 w-4" />
                <span>USSD Guide (*384#)</span>
              </Link>

              <Link
                to="/support"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>M-Pesa Support</span>
              </Link>

              <Link
                to="/contact"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">💬</span>
                <span>Contact Support</span>
              </Link>

              <Link
                to="/onboarding"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">🎓</span>
                <span>Training & Onboarding</span>
              </Link>
            </div>

            {/* M-Pesa Paybill */}
            <div className="bg-green-600/30 p-3 rounded-lg">
              <div className="text-sm font-semibold mb-1">
                📱 M-Pesa Paybill
              </div>
              <div className="text-lg font-bold">400200</div>
              <div className="text-xs text-orange-200">
                Account: Your Phone Number
              </div>
            </div>

            {/* Kenya County Hotlines */}
            <div className="space-y-2">
              <div className="text-sm font-semibold">🇰🇪 County Hotlines:</div>
              {kenyaContacts.slice(0, 2).map((contact) => (
                <div
                  key={contact.county}
                  className="text-xs text-orange-200 flex justify-between"
                >
                  <span>{contact.county}:</span>
                  <span>{contact.code}</span>
                </div>
              ))}
              <Link
                to="/help/contacts"
                className="text-xs text-white underline"
              >
                View all counties →
              </Link>
            </div>
          </div>

          {/* Column 3: Rhino Rules */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🦏</span>
              <h3 className="text-xl font-bold">Rhino Rules</h3>
            </div>

            <div className="space-y-3">
              <Link
                to="/legal/data-protection"
                onClick={playStampedeSound}
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Kenya Data Protection</span>
              </Link>

              <Link
                to="/legal/supplier-agreements"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Supplier Agreements</span>
              </Link>

              <Link
                to="/legal/fraud-reporting"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Fraud Reporting</span>
              </Link>

              <Link
                to="/legal/terms"
                className="block text-orange-100 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span className="text-sm">📜</span>
                <span>Terms of Service</span>
              </Link>
            </div>

            {/* Compliance Badges */}
            <div className="space-y-2">
              <div className="text-sm font-semibold">🛡️ Compliance:</div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white text-xs"
                >
                  KDPA Certified
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white text-xs"
                >
                  KRA Compliant
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white text-xs"
                >
                  CBK Licensed
                </Badge>
              </div>
            </div>

            {/* Security Certifications */}
            <div className="text-xs text-orange-200 space-y-1">
              <div>🔒 SSL/TLS Encrypted</div>
              <div>🛡️ PCI DSS Compliant</div>
              <div>✅ ISO 27001 Certified</div>
            </div>
          </div>

          {/* Column 4: Join the Herd */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐘</span>
              <h3 className="text-xl font-bold">Join the Herd</h3>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/company/savanna-marketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-100 hover:text-white transition-colors"
                title="Connect on LinkedIn (🦁 Lion Network)"
              >
                <Linkedin className="h-6 w-6" />
              </a>

              <a
                href="https://twitter.com/savannamarket"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-100 hover:text-white transition-colors"
                title="Follow on Twitter (🦜 Parrot Updates)"
              >
                <Twitter className="h-6 w-6" />
              </a>

              <a
                href="https://facebook.com/savannamarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-100 hover:text-white transition-colors"
                title="Like on Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>

              <a
                href="https://instagram.com/savannamarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-100 hover:text-white transition-colors"
                title="Follow on Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold mb-2">
                  🌱 Graze on News
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="your@email.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder:text-orange-200"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNewsletterSignup()
                    }
                  />
                  <Button
                    onClick={handleNewsletterSignup}
                    className="bg-white text-[#E2725B] hover:bg-orange-100 px-4"
                  >
                    Join
                  </Button>
                </div>
              </div>
            </div>

            {/* App Store Badges (Hidden in USSD mode) */}
            {!ussdMode && (
              <div className="space-y-3">
                <div className="text-sm font-semibold">📱 Download Apps:</div>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block bg-black/20 rounded-lg p-2 hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📱</span>
                      <div className="text-xs">
                        <div className="font-semibold">Download on the</div>
                        <div>App Store</div>
                      </div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="block bg-black/20 rounded-lg p-2 hover:bg-black/30 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🤖</span>
                      <div className="text-xs">
                        <div className="font-semibold">Get it on</div>
                        <div>Google Play</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* USSD Alternative */}
            {ussdMode && (
              <div className="bg-green-600/30 p-3 rounded-lg">
                <div className="text-sm font-semibold mb-2">
                  📱 No App Needed!
                </div>
                <div className="text-lg font-bold">*384*7#</div>
                <div className="text-xs text-orange-200">
                  Works on any phone
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-300/30 bg-[#CD5C5C]/50">
        <div className="w-full px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright & Company Info */}
            <div className="text-center md:text-left">
              <div className="text-sm text-orange-200">
                © 2025 Savanna Marketplace Ltd. • Registered in Kenya 🇰🇪
              </div>
              <div className="text-xs text-orange-300 mt-1">
                Building the future of African trade • KRA PIN: P051234567W
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <div className="text-xs text-orange-200">We accept:</div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center text-xs font-bold text-white">
                  MP
                </div>
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">
                  V
                </div>
                <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center text-xs font-bold text-white">
                  MC
                </div>
                <div className="w-8 h-5 bg-orange-600 rounded flex items-center justify-center text-xs font-bold text-white">
                  PP
                </div>
              </div>
            </div>

            {/* Back to Top */}
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              className="text-orange-200 hover:text-white hover:bg-white/10"
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>

      {/* Pride Message */}
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black py-2">
        <div className="w-full px-4 text-center">
          <div className="text-sm font-semibold">
            🦁 Built by the Universe, for Consiousness • Proudly serving Kenya since
            2025 🌍
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnterpriseFooter;
