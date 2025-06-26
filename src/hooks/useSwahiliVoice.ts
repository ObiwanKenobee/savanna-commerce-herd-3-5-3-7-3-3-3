import { useState, useEffect, useCallback } from "react";

export interface VoiceConfig {
  enableVoiceCommands: boolean;
  language: "en" | "sw";
  voiceSpeed: number;
}

export const useSwahiliVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [config, setConfig] = useState<VoiceConfig>({
    enableVoiceCommands: true,
    language: "en",
    voiceSpeed: 1.0,
  });

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    try {
      setIsListening(true);
      // Voice recognition logic would go here
      console.log("🎤 Voice listening started");
    } catch (error) {
      console.warn("Voice recognition failed:", error);
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    console.log("🎤 Voice listening stopped");
  }, []);

  const speak = useCallback(
    (text: string) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = config.language === "sw" ? "sw-KE" : "en-US";
        utterance.rate = config.voiceSpeed;
        speechSynthesis.speak(utterance);
      }
    },
    [config.language, config.voiceSpeed],
  );

  return {
    isListening,
    isSupported,
    config,
    setConfig,
    startListening,
    stopListening,
    speak,
  };
};
