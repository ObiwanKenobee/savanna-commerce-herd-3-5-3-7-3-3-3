/**
 * 📱 USSD Fallback Component
 * Seamless degradation when JavaScript fails or network is poor
 */

import React, { useState, useEffect } from "react";
import { usePerformanceOptimization } from "../../hooks/usePerformanceOptimization";

interface USSDFallbackProps {
  showAfterTimeout?: number; // Show after X seconds if JS/network fails
  forceShow?: boolean;
  className?: string;
}

interface USSDCode {
  code: string;
  description: string;
  category: "shopping" | "account" | "support" | "payments";
  network: "safaricom" | "airtel" | "telkom" | "all";
  swahiliDesc: string;
}

const USSD_CODES: USSDCode[] = [
  // Shopping & Orders
  {
    code: "*384*1#",
    description: "Browse Products & Place Orders",
    swahiliDesc: "Tazama bidhaa na agiza",
    category: "shopping",
    network: "safaricom",
  },
  {
    code: "*384*2#",
    description: "Check Order Status",
    swahiliDesc: "Angalia hali ya agizo",
    category: "shopping",
    network: "safaricom",
  },
  {
    code: "*384*3#",
    description: "View My Cart",
    swahiliDesc: "Ona kikapu changu",
    category: "shopping",
    network: "safaricom",
  },

  // Account Management
  {
    code: "*384*4#",
    description: "Account Balance & Credit",
    swahiliDesc: "Salio la akaunti na mkopo",
    category: "account",
    network: "safaricom",
  },
  {
    code: "*384*5#",
    description: "Business Profile",
    swahiliDesc: "Wasifu wa biashara",
    category: "account",
    network: "safaricom",
  },

  // Payments
  {
    code: "*384*6#",
    description: "Payment Options & History",
    swahiliDesc: "Njia za malipo na historia",
    category: "payments",
    network: "safaricom",
  },
  {
    code: "*384*7#",
    description: "Pay Outstanding Balance",
    swahiliDesc: "Lipa deni lako",
    category: "payments",
    network: "safaricom",
  },

  // Support
  {
    code: "*384*9#",
    description: "Customer Support",
    swahiliDesc: "Msaada kwa wateja",
    category: "support",
    network: "safaricom",
  },

  // Airtel alternatives
  {
    code: "*185*1#",
    description: "Savanna Marketplace (Airtel)",
    swahiliDesc: "Soko la Savanna (Airtel)",
    category: "shopping",
    network: "airtel",
  },

  // Telkom alternatives
  {
    code: "*544*1#",
    description: "Savanna Marketplace (Telkom)",
    swahiliDesc: "Soko la Savanna (Telkom)",
    category: "shopping",
    network: "telkom",
  },
];

const USSDFallback: React.FC<USSDFallbackProps> = ({
  showAfterTimeout = 3000,
  forceShow = false,
  className = "",
}) => {
  const [shouldShow, setShouldShow] = useState(forceShow);
  const [detectedNetwork, setDetectedNetwork] = useState<
    "safaricom" | "airtel" | "telkom" | "unknown"
  >("unknown");
  const [timeoutReached, setTimeoutReached] = useState(false);
  const { isSlowConnection, config } = usePerformanceOptimization();

  // Detect user's network provider
  useEffect(() => {
    const detectNetwork = () => {
      // Try to detect from stored M-Pesa number
      const mpesaNumber = localStorage.getItem("mpesa-number");
      if (mpesaNumber) {
        if (mpesaNumber.startsWith("2547")) {
          setDetectedNetwork("safaricom");
        } else if (
          mpesaNumber.startsWith("2573") ||
          mpesaNumber.startsWith("2571")
        ) {
          setDetectedNetwork("airtel");
        } else if (mpesaNumber.startsWith("2577")) {
          setDetectedNetwork("telkom");
        }
        return;
      }

      // Try to detect from user agent or other hints
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes("safaricom")) {
        setDetectedNetwork("safaricom");
      } else if (userAgent.includes("airtel")) {
        setDetectedNetwork("airtel");
      } else if (userAgent.includes("telkom")) {
        setDetectedNetwork("telkom");
      } else {
        // Default to Safaricom (largest provider in Kenya)
        setDetectedNetwork("safaricom");
      }
    };

    detectNetwork();
  }, []);

  // Show fallback after timeout or on slow connection
  useEffect(() => {
    if (forceShow) {
      setShouldShow(true);
      return;
    }

    // Show immediately on very slow connections
    if (isSlowConnection) {
      setShouldShow(true);
      return;
    }

    // Show after timeout
    const timer = setTimeout(() => {
      setTimeoutReached(true);
      // Check if page is still loading/broken
      const hasLoadedContent =
        document.querySelectorAll("[data-testid], [data-component]").length > 0;
      if (!hasLoadedContent) {
        setShouldShow(true);
      }
    }, showAfterTimeout);

    return () => clearTimeout(timer);
  }, [showAfterTimeout, forceShow, isSlowConnection]);

  // Hide when JavaScript is working properly
  useEffect(() => {
    const handlePageLoad = () => {
      if (!forceShow && !isSlowConnection) {
        setShouldShow(false);
      }
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => window.removeEventListener("load", handlePageLoad);
    }
  }, [forceShow, isSlowConnection]);

  if (!shouldShow) {
    return (
      <div
        id="ussd-fallback"
        className="ussd-fallback-hidden"
        style={{ display: "none" }}
      >
        {/* Hidden fallback that can be revealed by CSS if JS fails */}
        <div className="emergency-ussd-content">
          <h2>🦁 Savanna Marketplace</h2>
          <p>
            <strong>No internet? No problem!</strong>
            <br />
            Hakuna mtandao? Hakuna shida!
          </p>

          <div className="primary-ussd">
            <h3>Quick Access / Ufikiaji wa Haraka:</h3>
            <div className="ussd-code-display">*384*1#</div>
            <p>
              Dial this code for complete marketplace access
              <br />
              <em>Piga nambari hii kwa ufikiaji kamili wa soko</em>
            </p>
          </div>

          <div className="basic-instructions">
            <h4>How to use / Jinsi ya kutumia:</h4>
            <ol>
              <li>Open your phone dialer / Fungua kipiga nambari</li>
              <li>Dial *384*1# / Piga *384*1#</li>
              <li>Press call / Bonyeza kupiga</li>
              <li>Follow the menu / Fuata menyu</li>
            </ol>
          </div>

          <div className="emergency-contact">
            <p>
              <strong>Need help? / Unahitaji msaada?</strong>
            </p>
            <p>
              SMS: +254700000000
              <br />
              WhatsApp: +254700000001
            </p>
          </div>
        </div>
      </div>
    );
  }

  const relevantCodes = USSD_CODES.filter(
    (code) => code.network === detectedNetwork || code.network === "all",
  );

  const codesByCategory = relevantCodes.reduce(
    (acc, code) => {
      if (!acc[code.category]) acc[code.category] = [];
      acc[code.category].push(code);
      return acc;
    },
    {} as Record<string, USSDCode[]>,
  );

  const handleDialCode = (code: string) => {
    // Try to initiate USSD dial on mobile devices
    if ("wtai" in window) {
      try {
        (window as any).wtai.wp.mc(code);
      } catch (error) {
        console.log("WTAI not supported, falling back to tel: link");
      }
    }

    // Fallback: copy to clipboard and show instruction
    navigator.clipboard
      ?.writeText(code)
      .then(() => {
        alert(
          `Code copied: ${code}\nDial this code on your phone / Piga nambari hii kwenye simu yako`,
        );
      })
      .catch(() => {
        // Final fallback: show code in alert
        alert(`Dial this code: ${code}\nPiga nambari hii: ${code}`);
      });
  };

  return (
    <div className={`ussd-fallback ${className}`} id="ussd-fallback">
      <div className="ussd-container">
        {/* Header */}
        <div className="ussd-header">
          <div className="sim-card-icon">
            <img
              src="/sim-card-icon.png"
              alt="SIM Card"
              onError={(e) => {
                // Fallback to text if image fails
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling!.textContent = "📱";
              }}
            />
            <span style={{ display: "none" }}>📱</span>
          </div>

          <div className="ussd-title">
            <h2>🦁 Savanna Marketplace</h2>
            <p className="ussd-subtitle">
              {isSlowConnection
                ? "Slow connection detected / Mtandao mwenye kasi ndogo"
                : "Quick access via phone / Ufikiaji wa haraka kwa simu"}
            </p>
          </div>

          <div className="network-indicator">
            <span className={`network-badge ${detectedNetwork}`}>
              {detectedNetwork.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main message */}
        <div className="ussd-main-message">
          <div className="primary-code">
            <h3>Quick Start / Anza Haraka:</h3>
            <button
              className="dial-button primary"
              onClick={() => handleDialCode("*384*1#")}
            >
              <span className="dial-code">*384*1#</span>
              <span className="dial-action">📞 DIAL / PIGA</span>
            </button>
            <p className="code-description">
              Complete marketplace access
              <br />
              <em>Ufikiaji kamili wa soko</em>
            </p>
          </div>
        </div>

        {/* Category sections */}
        <div className="ussd-categories">
          {Object.entries(codesByCategory).map(([category, codes]) => (
            <div key={category} className="ussd-category">
              <h4 className="category-title">
                {category === "shopping" && "🛒 Shopping / Ununuzi"}
                {category === "account" && "👤 Account / Akaunti"}
                {category === "payments" && "💰 Payments / Malipo"}
                {category === "support" && "🆘 Support / Msaada"}
              </h4>

              <div className="ussd-codes-grid">
                {codes.map((ussdCode, index) => (
                  <button
                    key={index}
                    className="ussd-code-button"
                    onClick={() => handleDialCode(ussdCode.code)}
                  >
                    <div className="code-header">
                      <span className="code">{ussdCode.code}</span>
                      <span className="network-badge-small">
                        {ussdCode.network}
                      </span>
                    </div>
                    <div className="code-description">
                      <div className="english">{ussdCode.description}</div>
                      <div className="swahili">{ussdCode.swahiliDesc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="ussd-instructions">
          <h4>📋 How to use / Jinsi ya kutumia:</h4>
          <ol>
            <li>
              <strong>Press button / Bonyeza kitufe</strong> - Code will be
              copied
              <br />
              <em>Nambari itakanuliwa</em>
            </li>
            <li>
              <strong>Open your phone dialer / Fungua kipiga nambari</strong>
              <br />
              <em>Fungua programu ya kupiga simu</em>
            </li>
            <li>
              <strong>Paste or type the code / Bandika au chapa nambari</strong>
              <br />
              <em>Bandika au andika nambari</em>
            </li>
            <li>
              <strong>Press call button / Bonyeza kitufe cha kupiga</strong>
              <br />
              <em>Bonyeza kitufe cha simu</em>
            </li>
          </ol>
        </div>

        {/* Network alternatives */}
        {detectedNetwork !== "unknown" && (
          <div className="network-alternatives">
            <h5>📡 Other networks / Mitandao mingine:</h5>
            <div className="alternative-codes">
              {USSD_CODES.filter(
                (code) =>
                  code.network !== detectedNetwork &&
                  code.category === "shopping",
              ).map((code, index) => (
                <button
                  key={index}
                  className="alternative-code"
                  onClick={() => handleDialCode(code.code)}
                >
                  {code.code} ({code.network})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emergency fallback */}
        <div className="emergency-fallback">
          <h5>🚨 Need immediate help? / Unahitaji msaada wa haraka?</h5>
          <div className="emergency-contacts">
            <button onClick={() => handleDialCode("*384*9#")}>
              *384*9# - Customer Support / Msaada
            </button>
            <button
              onClick={() =>
                (window.location.href = "sms:+254700000000?body=HELP")
              }
            >
              📱 SMS: +254700000000
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="ussd-footer">
          <p>
            🌍 Works on all phones / Inafanya kazi kwenye simu zote
            <br />
            📶 No internet required / Hakuna intaneti inayohitajika
          </p>

          {timeoutReached && !forceShow && (
            <button
              className="hide-fallback"
              onClick={() => setShouldShow(false)}
            >
              Try website again / Jaribu tovuti tena
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .ussd-fallback {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
          color: white;
          z-index: 9999;
          overflow-y: auto;
          font-family: system-ui, sans-serif;
        }

        .ussd-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
        }

        .ussd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .sim-card-icon img {
          width: 40px;
          height: 40px;
        }

        .ussd-title h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .ussd-subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .network-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .dial-button {
          background: #ff6b35;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          margin: 0.5rem 0;
          font-size: 1.1rem;
          font-weight: bold;
          transition: transform 0.2s;
        }

        .dial-button:hover {
          transform: scale(1.02);
        }

        .dial-button.primary {
          background: linear-gradient(45deg, #ff6b35, #f7931e);
          font-size: 1.3rem;
          padding: 1.5rem;
        }

        .dial-code {
          display: block;
          font-size: 1.5em;
          letter-spacing: 2px;
        }

        .dial-action {
          display: block;
          font-size: 0.8em;
          margin-top: 0.5rem;
        }

        .ussd-categories {
          margin: 2rem 0;
        }

        .ussd-category {
          margin-bottom: 1.5rem;
        }

        .category-title {
          color: #f7931e;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .ussd-codes-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }

        @media (min-width: 480px) {
          .ussd-codes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .ussd-code-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 1rem;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .ussd-code-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .code {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: bold;
          color: #f7931e;
        }

        .network-badge-small {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-size: 0.7rem;
        }

        .code-description .english {
          font-weight: 500;
        }

        .code-description .swahili {
          font-style: italic;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .ussd-instructions {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .ussd-instructions ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .ussd-instructions li {
          margin-bottom: 0.5rem;
        }

        .alternative-codes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .alternative-code {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .emergency-fallback {
          background: rgba(255, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 0, 0, 0.3);
          margin: 1.5rem 0;
        }

        .emergency-contacts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .emergency-contacts button {
          background: #ff4444;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .ussd-footer {
          text-align: center;
          margin: 2rem 0 1rem;
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .hide-fallback {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 1rem;
        }

        /* CSS-only fallback when JS is disabled */
        .ussd-fallback-hidden {
          display: none !important;
        }

        /* Show fallback when JS fails or takes too long */
        html:not(.js-loaded) .ussd-fallback-hidden,
        .no-js .ussd-fallback-hidden {
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default USSDFallback;

// Add this CSS to your main index.html to detect when JS loads
export const addJSDetection = () => {
  // Mark when JS has loaded
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("js-loaded");
  }
};
