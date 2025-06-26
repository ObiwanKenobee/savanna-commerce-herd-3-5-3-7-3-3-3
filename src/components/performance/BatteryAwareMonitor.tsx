/**
 * 🔋 Battery-Aware Performance Monitor
 * Adapts app behavior based on device battery level
 */

import React, { useEffect, useState } from "react";
import { usePerformanceOptimization } from "../../hooks/usePerformanceOptimization";

interface BatteryAwareMonitorProps {
  children: React.ReactNode;
  className?: string;
}

interface BatteryState {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  lowPowerMode: boolean;
}

const BatteryAwareMonitor: React.FC<BatteryAwareMonitorProps> = ({
  children,
  className = "",
}) => {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 1,
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    lowPowerMode: false,
  });
  const [showBatteryWarning, setShowBatteryWarning] = useState(false);
  const { updateConfig, config } = usePerformanceOptimization();

  // Initialize battery monitoring
  useEffect(() => {
    let battery: any = null;

    const initBattery = async () => {
      if ("getBattery" in navigator) {
        try {
          battery = await (navigator as any).getBattery();
          updateBatteryState(battery);

          // Add event listeners
          battery.addEventListener("levelchange", () =>
            updateBatteryState(battery),
          );
          battery.addEventListener("chargingchange", () =>
            updateBatteryState(battery),
          );
          battery.addEventListener("chargingtimechange", () =>
            updateBatteryState(battery),
          );
          battery.addEventListener("dischargingtimechange", () =>
            updateBatteryState(battery),
          );
        } catch (error) {
          console.log("Battery API not available");
        }
      }
    };

    initBattery();

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", updateBatteryState);
        battery.removeEventListener("chargingchange", updateBatteryState);
        battery.removeEventListener("chargingtimechange", updateBatteryState);
        battery.removeEventListener(
          "dischargingtimechange",
          updateBatteryState,
        );
      }
    };
  }, []);

  const updateBatteryState = (battery: any) => {
    const newState: BatteryState = {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      lowPowerMode: battery.level < 0.2 && !battery.charging,
    };

    setBatteryState(newState);

    // Update app configuration based on battery state
    adaptConfigForBattery(newState);
  };

  const adaptConfigForBattery = (battery: BatteryState) => {
    const lowBattery = battery.level < 0.2;
    const criticalBattery = battery.level < 0.1;
    const veryLowBattery = battery.level < 0.05;

    if (veryLowBattery && !battery.charging) {
      // Emergency mode: Disable everything non-essential
      updateConfig({
        enableAnimations: false,
        imageQuality: "low",
        enablePrefetching: false,
        enableVoiceCommands: false,
        loadingStrategy: "tortoise",
      });
      setShowBatteryWarning(true);
    } else if (criticalBattery && !battery.charging) {
      // Critical mode: Minimal features only
      updateConfig({
        enableAnimations: false,
        imageQuality: "low",
        enablePrefetching: false,
        enableVoiceCommands: false,
        loadingStrategy: "tortoise",
      });
      setShowBatteryWarning(true);
    } else if (lowBattery && !battery.charging) {
      // Low power mode: Reduce resource usage
      updateConfig({
        enableAnimations: false,
        imageQuality: "medium",
        enablePrefetching: false,
        loadingStrategy: "elephant",
      });
      setShowBatteryWarning(true);
    } else if (battery.charging || battery.level > 0.3) {
      // Normal or charging: Restore features
      setShowBatteryWarning(false);
      // Don't automatically re-enable features; let user choose
    }

    // Update body class for CSS styling
    updateBodyClasses(battery);
  };

  const updateBodyClasses = (battery: BatteryState) => {
    const classes = [
      "low-power-mode",
      "critical-battery",
      "very-low-battery",
      "battery-charging",
    ];

    // Remove all battery classes
    classes.forEach((cls) => document.body.classList.remove(cls));

    // Add appropriate classes
    if (battery.level < 0.05) {
      document.body.classList.add("very-low-battery");
    } else if (battery.level < 0.1) {
      document.body.classList.add("critical-battery");
    } else if (battery.level < 0.2) {
      document.body.classList.add("low-power-mode");
    }

    if (battery.charging) {
      document.body.classList.add("battery-charging");
    }
  };

  const getBatteryIcon = () => {
    const { level, charging } = batteryState;

    if (charging) return "🔌";
    if (level < 0.05) return "🪫";
    if (level < 0.1) return "🔋";
    if (level < 0.2) return "🔋";
    if (level < 0.5) return "🔋";
    return "🔋";
  };

  const getBatteryColor = () => {
    const { level, charging } = batteryState;

    if (charging) return "#4CAF50";
    if (level < 0.05) return "#FF1744";
    if (level < 0.1) return "#FF5722";
    if (level < 0.2) return "#FF9800";
    if (level < 0.5) return "#FFC107";
    return "#4CAF50";
  };

  const getBatteryMessage = () => {
    const { level, charging, dischargingTime } = batteryState;

    if (charging) {
      return {
        en: "Charging... Features restored",
        sw: "Inachaji... Huduma zimerudishwa",
      };
    }

    if (level < 0.05) {
      return {
        en: "Critical battery! Emergency mode active",
        sw: "Betri ya hatari! Hali ya dharura imewashwa",
      };
    }

    if (level < 0.1) {
      return {
        en: "Very low battery. Essential features only",
        sw: "Betri ya chini sana. Huduma muhimu tu",
      };
    }

    if (level < 0.2) {
      const hours = Math.floor(dischargingTime / 3600);
      const minutes = Math.floor((dischargingTime % 3600) / 60);
      return {
        en: `Low battery (${hours}h ${minutes}m remaining). Power saving enabled`,
        sw: `Betri ya chini (${hours}s ${minutes}d zimebaki). Uokozi wa nishati umewashwa`,
      };
    }

    return null;
  };

  const enablePowerSaving = () => {
    updateConfig({
      enableAnimations: false,
      imageQuality: "low",
      enablePrefetching: false,
      enableVoiceCommands: false,
      loadingStrategy: "tortoise",
    });
    setShowBatteryWarning(false);
  };

  const dismissWarning = () => {
    setShowBatteryWarning(false);
  };

  const message = getBatteryMessage();

  return (
    <div className={`battery-aware-container ${className}`}>
      {/* Battery status indicator */}
      <div
        className="battery-indicator"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "0.5rem",
          borderRadius: "20px",
          fontSize: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 1000,
          opacity: batteryState.level < 0.3 ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>{getBatteryIcon()}</span>
        <span>{Math.round(batteryState.level * 100)}%</span>
      </div>

      {/* Battery warning banner */}
      {showBatteryWarning && message && (
        <div
          className="battery-warning-banner"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: getBatteryColor(),
            color: "white",
            padding: "1rem",
            textAlign: "center",
            zIndex: 10000,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="banner-content">
            <div
              className="battery-icon"
              style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}
            >
              {getBatteryIcon()}
            </div>

            <div className="battery-message">
              <div className="english">{message.en}</div>
              <div
                className="swahili"
                style={{ fontSize: "0.9rem", opacity: 0.9 }}
              >
                {message.sw}
              </div>
            </div>

            <div className="banner-actions" style={{ marginTop: "1rem" }}>
              {batteryState.level < 0.2 && !batteryState.charging && (
                <button
                  onClick={enablePowerSaving}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Enable Power Saving / Washa Uokozi wa Nishati
                </button>
              )}

              <button
                onClick={dismissWarning}
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Dismiss / Ondoa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content with battery-aware styling */}
      <div
        className={`
          battery-aware-content 
          ${batteryState.lowPowerMode ? "low-power-mode" : ""}
          ${batteryState.charging ? "battery-charging" : ""}
        `}
        style={{
          marginTop: showBatteryWarning ? "120px" : "0",
          transition: "margin-top 0.3s ease",
        }}
      >
        {children}
      </div>

      <style jsx>{`
        /* Battery-aware styling */
        .low-power-mode {
          animation: none !important;
        }

        .low-power-mode * {
          animation: none !important;
          transition-duration: 0.1s !important;
        }

        .critical-battery {
          filter: grayscale(0.5) !important;
        }

        .very-low-battery {
          filter: grayscale(0.8) !important;
        }

        .battery-charging {
          border-left: 3px solid #4caf50;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .battery-indicator {
            top: 5px !important;
            right: 5px !important;
            padding: 0.25rem 0.5rem !important;
            font-size: 0.7rem !important;
          }

          .battery-warning-banner {
            padding: 0.75rem !important;
            font-size: 0.9rem !important;
          }

          .banner-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .banner-actions button {
            width: 100%;
            margin-right: 0 !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .battery-indicator {
            background: black !important;
            border: 2px solid white;
          }

          .battery-warning-banner {
            border-bottom: 3px solid white;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .battery-indicator,
          .battery-warning-banner,
          .battery-aware-content {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BatteryAwareMonitor;

// Hook for battery-aware features
export const useBatteryAware = () => {
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [isCharging, setIsCharging] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  useEffect(() => {
    const initBattery = async () => {
      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();

          const updateState = () => {
            setBatteryLevel(battery.level);
            setIsCharging(battery.charging);
            setLowPowerMode(battery.level < 0.2 && !battery.charging);
          };

          updateState();

          battery.addEventListener("levelchange", updateState);
          battery.addEventListener("chargingchange", updateState);

          return () => {
            battery.removeEventListener("levelchange", updateState);
            battery.removeEventListener("chargingchange", updateState);
          };
        } catch (error) {
          console.log("Battery API not available");
        }
      }
    };

    initBattery();
  }, []);

  return {
    batteryLevel,
    isCharging,
    lowPowerMode,
    shouldReduceAnimations: lowPowerMode,
    shouldReduceQuality: batteryLevel < 0.3,
    shouldDisableFeatures: batteryLevel < 0.1,
  };
};
