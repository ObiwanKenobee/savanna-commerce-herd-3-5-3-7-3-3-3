import { useState, useEffect } from "react";

export interface PerformanceConfig {
  enableUSSDFallback: boolean;
  enableBatteryMonitoring: boolean;
  enableRouteTransitions: boolean;
}

export const usePerformanceOptimization = (
  config: PerformanceConfig = {
    enableUSSDFallback: false,
    enableBatteryMonitoring: false,
    enableRouteTransitions: true,
  },
) => {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<
    "fast" | "slow" | "offline"
  >("fast");
  const [batteryLevel, setBatteryLevel] = useState(100);

  useEffect(() => {
    // Monitor network quality
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      const updateNetworkStatus = () => {
        if (
          connection.effectiveType === "2g" ||
          connection.effectiveType === "slow-2g"
        ) {
          setNetworkQuality("slow");
        } else {
          setNetworkQuality("fast");
        }
      };

      connection.addEventListener("change", updateNetworkStatus);
      updateNetworkStatus();

      return () =>
        connection.removeEventListener("change", updateNetworkStatus);
    }
  }, []);

  useEffect(() => {
    // Monitor battery level if supported
    if (config.enableBatteryMonitoring && "getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryLevel = () => {
          setBatteryLevel(battery.level * 100);
          setIsLowPowerMode(battery.level < 0.2);
        };

        battery.addEventListener("levelchange", updateBatteryLevel);
        updateBatteryLevel();

        return () =>
          battery.removeEventListener("levelchange", updateBatteryLevel);
      });
    }
  }, [config.enableBatteryMonitoring]);

  return {
    isLowPowerMode,
    networkQuality,
    batteryLevel,
    shouldUseUSSD:
      config.enableUSSDFallback &&
      (networkQuality === "slow" || isLowPowerMode),
    shouldReduceAnimations: isLowPowerMode || networkQuality === "slow",
  };
};
