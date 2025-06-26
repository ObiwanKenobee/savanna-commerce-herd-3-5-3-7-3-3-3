import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Search,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { NEO_SAVANNAH_THEME } from "@/theme/neo-savannah-theme";

interface MzeeCyberProps {
  onSearch?: (query: string) => void;
  onPurchase?: (item: any) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "mzee";
  message: string;
  timestamp: Date;
  action?: "search" | "purchase" | "info";
}

const MzeeCyber: React.FC<MzeeCyberProps> = ({
  onSearch,
  onPurchase,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthesis.current = window.speechSynthesis;

    // Welcome message
    if (messages.length === 0) {
      setTimeout(() => {
        addMzeeMessage(NEO_SAVANNAH_THEME.aiGuide.voice.greeting);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const addMzeeMessage = (
    message: string,
    action?: "search" | "purchase" | "info",
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "mzee",
      message,
      timestamp: new Date(),
      action,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Speak the message
    if (synthesis.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 0.7;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      synthesis.current.speak(utterance);
    }
  };

  const handleUserMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Process user message with AI-like responses
    setTimeout(() => {
      processUserMessage(message);
    }, 1000);
  };

  const processUserMessage = (message: string) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("search") ||
        lowerMessage.includes("find") ||
        lowerMessage.includes("show me")
      ) {
        const searchTerm = extractSearchTerm(message);
        addMzeeMessage(
          `${NEO_SAVANNAH_THEME.aiGuide.voice.search} Scanning the digital savannah for "${searchTerm}"...`,
          "search",
        );
        if (onSearch) {
          onSearch(searchTerm);
        }
      } else if (
        lowerMessage.includes("buy") ||
        lowerMessage.includes("purchase") ||
        lowerMessage.includes("order")
      ) {
        addMzeeMessage(NEO_SAVANNAH_THEME.aiGuide.voice.purchase, "purchase");
      } else if (
        lowerMessage.includes("help") ||
        lowerMessage.includes("guide")
      ) {
        addMzeeMessage(`Welcome to Neo-Savannah, digital warrior! I am Mzee Cyber, your AI guide through this cybernetic wilderness. I can help you:
        
🔍 Search for products: "Find organic honey"
🛒 Make purchases: "Buy this item" 
💰 Check prices: "How much does this cost?"
🦁 Learn about vendors: "Tell me about this seller"
🌍 Navigate the marketplace: "Show me categories"`);
      } else if (
        lowerMessage.includes("price") ||
        lowerMessage.includes("cost") ||
        lowerMessage.includes("how much")
      ) {
        addMzeeMessage(
          `The digital spirits whisper of fair prices in our cyber-savannah. Current exchange rates: 1 Mboga Coin = 100 KES. Premium vendors display holographic price tags that shimmer with transparency.`,
        );
      } else if (
        lowerMessage.includes("hello") ||
        lowerMessage.includes("hi") ||
        lowerMessage.includes("jambo")
      ) {
        const greetings = [
          "Jambo, cyber-warrior! The digital ancestors smile upon your journey.",
          "Habari za digital safari? Welcome to our neon-lit marketplace!",
          "Salaam, tech-savvy trader! Ready to explore the quantum corridors of commerce?",
        ];
        addMzeeMessage(greetings[Math.floor(Math.random() * greetings.length)]);
      } else {
        addMzeeMessage(
          `I sense your digital aura, but the cyber-winds carry unclear signals. Try asking me to search for items, help with purchases, or guide you through Neo-Savannah's features.`,
        );
      }
    }, 2000);
  };

  const extractSearchTerm = (message: string): string => {
    const patterns = [
      /(?:search|find|show me|looking for)\s+(.+)/i,
      /(.+?)(?:\s+please)?$/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return message;
  };

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopSpeaking = () => {
    if (synthesis.current) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMzee = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Play activation sound
      playSound("activation");
    }
  };

  const playSound = (type: string) => {
    // Placeholder for sound effects
    console.log(`Playing ${type} sound`);
  };

  return (
    <>
      {/* Floating Mzee Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={toggleMzee}
          className={`
            w-16 h-16 rounded-full neon-btn relative overflow-hidden
            ${isOpen ? "animate-cyber-pulse" : "animate-neon-flicker"}
          `}
          aria-label="Open AI Market Guide"
        >
          <div className="text-2xl animate-hologram">
            {NEO_SAVANNAH_THEME.aiGuide.avatar}
          </div>

          {/* Notification dot for new features */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-hot-pink rounded-full animate-ping"></div>
        </Button>
      </div>

      {/* Mzee Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] z-50">
          <Card className="cyber-card bg-cyber-black/90 border-holographic-green/30 backdrop-blur-lg">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-holographic-green/20 to-glowing-blue/20 p-4 border-b border-holographic-green/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl animate-hologram">
                      {NEO_SAVANNAH_THEME.aiGuide.avatar}
                    </div>
                    <div>
                      <h3 className="cyber-heading text-sm">
                        {NEO_SAVANNAH_THEME.aiGuide.name}
                      </h3>
                      <p className="digital-text text-xs opacity-80">
                        {NEO_SAVANNAH_THEME.aiGuide.personality}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isSpeaking && (
                      <Button
                        onClick={stopSpeaking}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-electric-amber hover:bg-electric-amber/20"
                      >
                        <VolumeX className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      onClick={() => setIsOpen(false)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-holographic-green hover:bg-holographic-green/20"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatRef}
                className="h-80 overflow-y-auto p-4 space-y-4 scanlines"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                      max-w-[80%] p-3 rounded-lg digital-text text-sm
                      ${
                        msg.type === "user"
                          ? "bg-glowing-blue/20 border border-glowing-blue/30 text-glowing-blue"
                          : "bg-holographic-green/10 border border-holographic-green/30 text-holographic-green"
                      }
                    `}
                    >
                      {msg.message}

                      {/* Action Buttons */}
                      {msg.action && (
                        <div className="mt-2 pt-2 border-t border-current/20">
                          {msg.action === "search" && (
                            <Button
                              size="sm"
                              className="neon-btn h-8 text-xs"
                              onClick={() => onSearch && onSearch("honey")}
                            >
                              <Search className="h-3 w-3 mr-1" />
                              Search Now
                            </Button>
                          )}
                          {msg.action === "purchase" && (
                            <Button
                              size="sm"
                              className="neon-btn h-8 text-xs"
                              onClick={() => onPurchase && onPurchase({})}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-holographic-green/10 border border-holographic-green/30 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-holographic-green rounded-full animate-ping"></div>
                        <div
                          className="w-2 h-2 bg-holographic-green rounded-full animate-ping"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-holographic-green rounded-full animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-holographic-green/30 bg-cyber-black/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      inputValue.trim() &&
                      handleUserMessage(inputValue)
                    }
                    placeholder="Ask Mzee Cyber anything..."
                    className="
                      flex-1 bg-transparent border border-holographic-green/30 rounded-lg px-3 py-2 
                      digital-text text-sm placeholder:text-holographic-green/50 
                      focus:outline-none focus:border-holographic-green focus:ring-1 focus:ring-holographic-green
                    "
                  />

                  <Button
                    onClick={() =>
                      inputValue.trim() && handleUserMessage(inputValue)
                    }
                    size="sm"
                    className="neon-btn h-10 w-10 p-0"
                    disabled={!inputValue.trim()}
                  >
                    <Bot className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={startListening}
                    size="sm"
                    className={`h-10 w-10 p-0 ${isListening ? "bg-electric-amber text-cyber-black" : "neon-btn"}`}
                    disabled={isListening}
                  >
                    {isListening ? (
                      <Mic className="h-4 w-4 animate-pulse" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {[
                    "Find honey",
                    "Show categories",
                    "Check prices",
                    "Help",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      onClick={() => handleUserMessage(suggestion)}
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-holographic-green/70 hover:text-holographic-green hover:bg-holographic-green/10"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Particles Effect */}
          <div className="particles absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  backgroundColor: i % 2 === 0 ? "#00FF9F" : "#00D4FF",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MzeeCyber;
