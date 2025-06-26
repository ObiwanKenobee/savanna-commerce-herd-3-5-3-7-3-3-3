import { useCallback, useRef, useState, useEffect } from "react";
import { AUDIO_LIBRARY } from "@/theme/savannah-theme";

export const useSavannahAudio = () => {
  const audioRef = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3); // Keep safari sounds subtle
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio safely
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const preloadAudio = useCallback(
    (audioKey: string, src: string) => {
      if (!audioRef.current[audioKey]) {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.preload = "auto";
        audioRef.current[audioKey] = audio;
      }
    },
    [volume],
  );

  const playSound = useCallback(
    (
      soundType:
        | keyof typeof AUDIO_LIBRARY.interactions
        | keyof typeof AUDIO_LIBRARY.ambient,
    ) => {
      if (!isEnabled || !isInitialized) return;

      try {
        const soundPath =
          AUDIO_LIBRARY.interactions[
            soundType as keyof typeof AUDIO_LIBRARY.interactions
          ] ||
          AUDIO_LIBRARY.ambient[
            soundType as keyof typeof AUDIO_LIBRARY.ambient
          ];

        if (!soundPath) return;

        if (!audioRef.current[soundType]) {
          preloadAudio(soundType, soundPath);
        }

        const audio = audioRef.current[soundType];
        if (audio) {
          audio.currentTime = 0;
          audio.volume = volume;
          audio.play().catch(() => {
            // Safari/mobile browsers may block autoplay - fail silently
          });
        }
      } catch (error) {
        // Fail silently for audio issues
        console.debug("Audio playback failed:", error);
      }
    },
    [isEnabled, volume, preloadAudio],
  );

  const playSuccessRoar = useCallback(() => {
    playSound("success_order");
  }, [playSound]);

  const playHyenaLaugh = useCallback(() => {
    playSound("error");
  }, [playSound]);

  const playWaterDrop = useCallback(() => {
    playSound("payment_success");
  }, [playSound]);

  const playClickSound = useCallback(() => {
    playSound("button_click");
  }, [playSound]);

  const playNotification = useCallback(() => {
    playSound("notification");
  }, [playSound]);

  const toggleAudio = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  const setAudioVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);

    // Update volume for all loaded audio elements
    Object.values(audioRef.current).forEach((audio) => {
      audio.volume = clampedVolume;
    });
  }, []);

  return {
    playSound,
    playSuccessRoar,
    playHyenaLaugh,
    playWaterDrop,
    playClickSound,
    playNotification,
    isEnabled,
    volume,
    toggleAudio,
    setAudioVolume,
  };
};
