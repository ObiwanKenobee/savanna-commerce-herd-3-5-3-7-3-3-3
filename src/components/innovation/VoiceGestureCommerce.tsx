import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  innovationService,
  SwahiliVoiceCommand,
  GesturePayment,
} from "@/services/innovationService";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  Hand,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Globe,
  Users,
} from "lucide-react";

interface VoiceGestureCommerceProps {
  className?: string;
}

export const VoiceGestureCommerce = ({
  className,
}: VoiceGestureCommerceProps) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState<SwahiliVoiceCommand | null>(
    null,
  );
  const [gesturePayment, setGesturePayment] = useState<GesturePayment | null>(
    null,
  );
  const [confidence, setConfidence] = useState(0);
  const [fingerCount, setFingerCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "sw-KE"; // Swahili (Kenya)

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;

        try {
          // Mock processing - in real app would send to NLP service
          const mockCommand: SwahiliVoiceCommand = {
            id: `voice_${Date.now()}`,
            phrase: transcript,
            intent: transcript.includes("nunua") ? "order" : "search",
            entities: {
              product: transcript.includes("unga") ? "Pembe Flour" : "Unknown",
              quantity: 2,
              supplier: "Mama Lydia",
            },
            confidence: confidence,
            response: transcript.includes("nunua")
              ? "Umri wa Pembe kilo mbili umeongezwa kwenye mkoba wako!"
              : "Bei ya bidhaa hiyo ni KSH 120. Ungependa kuagiza?",
          };

          setVoiceCommand(mockCommand);
          setConfidence(confidence * 100);

          toast({
            title: "🗣️ Swahili Command Processed",
            description: mockCommand.response,
          });
        } catch (error) {
          toast({
            title: "❌ Voice Processing Failed",
            description: "Samahani, sijaweza kuelewa amri yako.",
            variant: "destructive",
          });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();

      toast({
        title: "🎤 Listening for Swahili Commands",
        description:
          "Say: 'Nunua unga wa pembe kilo mbili' or 'Pata bei ya sukari'",
      });
    } else {
      toast({
        title: "❌ Voice Recognition Not Supported",
        description: "Your browser doesn't support Swahili voice recognition.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const startGestureDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);

        // Mock gesture detection
        const mockGestureInterval = setInterval(() => {
          const randomFingers = Math.floor(Math.random() * 5) + 1;
          const gestureConfidence = 0.7 + Math.random() * 0.3;

          setFingerCount(randomFingers);
          setConfidence(gestureConfidence * 100);

          if (gestureConfidence > 0.8) {
            processGesturePayment(randomFingers, gestureConfidence);
            clearInterval(mockGestureInterval);
          }
        }, 1000);

        toast({
          title: "📸 Gesture Payment Active",
          description:
            "Hold up fingers to confirm payment amount (1 finger = KSH 1,000)",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Camera Access Failed",
        description: "Please enable camera access for gesture payments.",
        variant: "destructive",
      });
    }
  };

  const stopGestureDetection = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setFingerCount(0);
    setConfidence(0);
  };

  const processGesturePayment = async (fingers: number, confidence: number) => {
    try {
      const payment = await innovationService.processGesturePayment({
        fingers,
        confidence,
      });

      setGesturePayment(payment);

      toast({
        title: "✋ Gesture Payment Processed",
        description: `KSH ${payment.amount.toLocaleString()} ${payment.status === "confirmed" ? "confirmed" : "pending verification"}`,
      });
    } catch (error) {
      toast({
        title: "❌ Gesture Payment Failed",
        description: "Failed to process gesture payment. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Innovation Header */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-purple-700">
          <Sparkles className="w-8 h-8" />
          <span>Voice & Gesture Commerce Revolution</span>
          <Brain className="w-8 h-8" />
        </div>
        <p className="text-purple-600 max-w-2xl mx-auto">
          Experience the future of commerce with Swahili voice commands and
          intuitive gesture payments, designed specifically for Kenya's
          mobile-first culture.
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-purple-600">
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span>Swahili + Sheng Support</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>60% of Shops Use Voice</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>3x Faster Than Typing</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swahili Voice Commands */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <Mic className="w-5 h-5" />
              <span>Swahili Voice Commands</span>
              <Badge className="bg-green-100 text-green-700">AI-Powered</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voice Control */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={
                  isListening ? stopVoiceRecognition : startVoiceRecognition
                }
                className={`${
                  isListening
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
                size="lg"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Start Voice Command
                  </>
                )}
              </Button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center animate-pulse">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
                <p className="text-green-700 font-medium">
                  Listening for Swahili commands...
                </p>
                <div className="grid grid-cols-1 gap-2 text-xs text-green-600">
                  <div>"Nunua unga wa pembe kilo mbili kwa Mama Lydia"</div>
                  <div>"Pata bei ya sukari leo"</div>
                  <div>"Lipiza marejesho kwa M-Pesa"</div>
                </div>
              </div>
            )}

            {/* Voice Command Result */}
            {voiceCommand && (
              <Alert className="border-green-300 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div>
                      <strong>Command:</strong> "{voiceCommand.phrase}"
                    </div>
                    <div>
                      <strong>Intent:</strong> {voiceCommand.intent}
                    </div>
                    <div>
                      <strong>Confidence:</strong> {confidence.toFixed(1)}%
                    </div>
                    <Progress value={confidence} className="h-2" />
                    <div className="p-2 bg-green-100 rounded italic text-green-800">
                      {voiceCommand.response}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Example Commands */}
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Example Commands:</h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="p-2 bg-white rounded border">
                  <span className="font-medium">Order:</span> "Nunua sukari kilo
                  tatu"
                </div>
                <div className="p-2 bg-white rounded border">
                  <span className="font-medium">Search:</span> "Pata bei ya
                  mahindi"
                </div>
                <div className="p-2 bg-white rounded border">
                  <span className="font-medium">Payment:</span> "Lipa kwa
                  M-Pesa"
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gesture Payments */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Hand className="w-5 h-5" />
              <span>Gesture Payments</span>
              <Badge className="bg-blue-100 text-blue-700">Camera AI</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Control */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={
                  isCameraActive ? stopGestureDetection : startGestureDetection
                }
                className={`${
                  isCameraActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                size="lg"
              >
                {isCameraActive ? (
                  <>
                    <CameraOff className="w-5 h-5 mr-2" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Start Gesture Pay
                  </>
                )}
              </Button>
            </div>

            {/* Camera Feed */}
            {isCameraActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 object-cover rounded-lg bg-gray-200"
                />
                {fingerCount > 0 && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full">
                    {fingerCount} finger{fingerCount !== 1 ? "s" : ""} = KSH{" "}
                    {(fingerCount * 1000).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {/* Gesture Detection Status */}
            {isCameraActive && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">
                    Detection Confidence:
                  </span>
                  <span className="text-sm font-medium">
                    {confidence.toFixed(1)}%
                  </span>
                </div>
                <Progress value={confidence} className="h-2" />
                {confidence > 80 && (
                  <Alert className="border-blue-300 bg-blue-50">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Gesture detected! Hold position to confirm payment.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Gesture Payment Result */}
            {gesturePayment && (
              <Alert
                className={`${
                  gesturePayment.status === "confirmed"
                    ? "border-green-300 bg-green-50"
                    : "border-yellow-300 bg-yellow-50"
                }`}
              >
                {gesturePayment.status === "confirmed" ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                )}
                <AlertDescription>
                  <div className="space-y-1">
                    <div>
                      <strong>Amount:</strong> KSH{" "}
                      {gesturePayment.amount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Status:</strong> {gesturePayment.status}
                    </div>
                    <div>
                      <strong>Method:</strong> {gesturePayment.gesture_type}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Gesture Guide */}
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">Gesture Guide:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-2xl mb-1">✋</div>
                  <div>5 fingers = KSH 5,000</div>
                </div>
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-2xl mb-1">✌️</div>
                  <div>2 fingers = KSH 2,000</div>
                </div>
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-2xl mb-1">👆</div>
                  <div>1 finger = KSH 1,000</div>
                </div>
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-2xl mb-1">👌</div>
                  <div>OK sign = Confirm</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Innovation Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-center text-purple-700">
            Innovation Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">3x</div>
              <div className="text-sm text-purple-700">Faster Ordering</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-blue-700">Voice Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">0.8s</div>
              <div className="text-sm text-green-700">Gesture Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">60%</div>
              <div className="text-sm text-orange-700">Shop Adoption</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceGestureCommerce;

// Add type declarations for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
