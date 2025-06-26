import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Smartphone,
  Hash,
  Star,
  ArrowLeft,
  ArrowRight,
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { ussdProductService } from "../../services/ussdProductService";

interface USSDProductFlowProps {
  userId: string;
}

interface USSDState {
  screen: string;
  input: string;
  sessionData: Record<string, any>;
  history: string[];
  loading: boolean;
  completed: boolean;
}

const FEATURE_PHONE_STYLE = {
  container: "bg-gray-900 rounded-2xl p-4 max-w-md mx-auto shadow-2xl",
  screen:
    "bg-green-900 text-green-100 font-mono text-sm p-4 rounded-lg min-h-[200px] border-2 border-green-700",
  keypad: "grid grid-cols-3 gap-2 mt-4",
  key: "bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded text-center cursor-pointer transition-colors",
};

export const USSDProductFlow: React.FC<USSDProductFlowProps> = ({ userId }) => {
  const [ussdState, setUssdState] = useState<USSDState>({
    screen: "",
    input: "",
    sessionData: {},
    history: [],
    loading: false,
    completed: false,
  });

  const [sessionId, setSessionId] = useState<string>("");
  const [phoneNumber] = useState("+254712345678"); // Mock phone number

  useEffect(() => {
    // Start USSD session
    startSession();
  }, []);

  const startSession = async () => {
    setUssdState((prev) => ({ ...prev, loading: true }));

    try {
      // Simulate dialing *384*1#
      const response = await ussdProductService.handleUSSDRequest(
        phoneNumber,
        "",
        undefined,
      );
      const newSessionId = `ussd_${Date.now()}`;

      setSessionId(newSessionId);
      setUssdState({
        screen: response.message,
        input: "",
        sessionData: {},
        history: ["*384*1# - Savannah Product Upload"],
        loading: false,
        completed: response.action === "end",
      });
    } catch (error) {
      console.error("Failed to start USSD session:", error);
      setUssdState((prev) => ({
        ...prev,
        loading: false,
        screen: "Samahani, huduma haipatikani sasa hivi. Jaribu tena baadaye.",
      }));
    }
  };

  const handleInput = async (input: string) => {
    if (ussdState.completed) {
      startSession();
      return;
    }

    setUssdState((prev) => ({
      ...prev,
      loading: true,
      input: input,
      history: [...prev.history, `Input: ${input}`],
    }));

    try {
      const response = await ussdProductService.handleUSSDRequest(
        phoneNumber,
        input,
        sessionId,
      );

      setUssdState((prev) => ({
        ...prev,
        screen: response.message,
        loading: false,
        completed: response.action === "end",
        history: [...prev.history, response.message],
      }));
    } catch (error) {
      console.error("USSD input handling failed:", error);
      setUssdState((prev) => ({
        ...prev,
        loading: false,
        screen: "Hitilafu imetokea. Jaribu tena.\n0. Rudi",
      }));
    }
  };

  const renderFeaturePhone = () => {
    return (
      <div className={FEATURE_PHONE_STYLE.container}>
        {/* Phone Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs">Safaricom</span>
          </div>
          <div className="text-white text-xs">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Screen */}
        <div className={FEATURE_PHONE_STYLE.screen}>
          {ussdState.loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-pulse">📡</div>
                <div className="mt-2">Inaomba...</div>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-line">{ussdState.screen}</div>
          )}
        </div>

        {/* Keypad */}
        <div className={FEATURE_PHONE_STYLE.keypad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
            (key) => (
              <button
                key={key}
                className={FEATURE_PHONE_STYLE.key}
                onClick={() => handleInput(key)}
                disabled={ussdState.loading}
              >
                {key}
              </button>
            ),
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={startSession}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            End Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleInput("0")}
            disabled={ussdState.loading}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Back (0)
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 text-center">
          <Badge
            variant={ussdState.completed ? "default" : "secondary"}
            className="text-xs"
          >
            {ussdState.completed ? "Session Ended" : "Session Active"}
          </Badge>
        </div>
      </div>
    );
  };

  const renderInstructions = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5" />
            <span>USSD Product Upload Guide</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* How it Works */}
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>How USSD Upload Works</span>
            </h4>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Dial USSD Code</p>
                  <p className="text-sm text-muted-foreground">
                    Dial <code className="bg-muted px-1 rounded">*384*1#</code>{" "}
                    on any phone to start
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Follow Menu Prompts</p>
                  <p className="text-sm text-muted-foreground">
                    Navigate using number keys to select options
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Enter Product Details</p>
                  <p className="text-sm text-muted-foreground">
                    Provide name, price, unit, and optional photo
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium">Complete Cultural Captcha</p>
                  <p className="text-sm text-muted-foreground">
                    Answer a simple question about Kenyan culture
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <div>
                  <p className="font-medium">Get Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    Receive SMS confirmation with tracking reference
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* USSD Codes */}
          <div>
            <h4 className="font-medium mb-3">Quick USSD Codes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-muted p-3 rounded-lg">
                <code className="font-mono text-sm">*384*1#</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Add new product
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <code className="font-mono text-sm">*384*2#</code>
                <p className="text-xs text-muted-foreground mt-1">
                  View my products
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <code className="font-mono text-sm">*384*MARKET#</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Check market prices
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <code className="font-mono text-sm">*384*999#</code>
                <p className="text-xs text-muted-foreground mt-1">
                  Report suspicious listing
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cultural Captcha Examples */}
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Cultural Captcha Examples</span>
            </h4>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-orange-900">
                    Wildlife Question:
                  </p>
                  <p className="text-sm text-orange-700">
                    "Miguu mingapi ina dik-dik?" (How many legs does a dik-dik
                    have?)
                  </p>
                </div>
                <div>
                  <p className="font-medium text-orange-900">
                    Cultural Question:
                  </p>
                  <p className="text-sm text-orange-700">
                    "Mti gani ni muhimu kwa Wamaasai?" (Which tree is important
                    to the Maasai?)
                  </p>
                </div>
                <div>
                  <p className="font-medium text-orange-900">
                    Geography Question:
                  </p>
                  <p className="text-sm text-orange-700">
                    "Mlima mrefu zaidi Kenya ni upi?" (Which is Kenya's tallest
                    mountain?)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Benefits */}
          <div>
            <h4 className="font-medium mb-3">Why Use USSD Upload?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Works on any phone</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">No internet required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Instant confirmation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Cultural security</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSessionHistory = () => {
    if (ussdState.history.length === 0) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Session History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {ussdState.history.map((entry, index) => (
              <div
                key={index}
                className="text-xs font-mono bg-muted p-2 rounded"
              >
                {entry}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-6 w-6" />
            <span>USSD Product Upload Simulator</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Experience how farmers and suppliers upload products using feature
            phones
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phone Simulator */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Feature Phone Simulation</h3>
          {renderFeaturePhone()}
          {renderSessionHistory()}
        </div>

        {/* Instructions */}
        <div>{renderInstructions()}</div>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">
                Real Implementation Note
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                In production, this USSD service integrates with Safaricom's
                USSD gateway. The cultural captcha system prevents automated
                spam while being accessible to users with local knowledge. All
                sessions are logged for security and support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default USSDProductFlow;
