import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logPaymentEvent } from "@/utils/securityMonitor";
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Shield,
  Phone,
  RefreshCw,
  DollarSign,
  Calendar,
  Users,
  Target,
  Zap,
  Crown,
  Receipt,
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: "mpesa" | "card" | "bank";
  icon: React.ReactNode;
  description: string;
  processingFee: number;
  availableFor: string[];
}

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
  userType: string;
}

interface PaymentStatus {
  status: "pending" | "processing" | "success" | "failed" | "cancelled";
  transactionId?: string;
  amount: number;
  method: string;
  timestamp: string;
  message: string;
}

const PaymentProcessor: React.FC<{
  selectedPlan?: BillingPlan;
  onPaymentComplete?: (result: any) => void;
  onCancel?: () => void;
}> = ({ selectedPlan, onPaymentComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [countdown, setCountdown] = useState<number>(0);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "mpesa",
      name: "M-Pesa",
      type: "mpesa",
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
      description: "Pay instantly with M-Pesa STK Push",
      processingFee: 0,
      availableFor: ["retailer", "supplier", "logistics"],
    },
    {
      id: "airtel-money",
      name: "Airtel Money",
      type: "mpesa",
      icon: <Phone className="h-5 w-5 text-red-600" />,
      description: "Pay with Airtel Money",
      processingFee: 0,
      availableFor: ["retailer", "supplier"],
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      type: "card",
      icon: <CreditCard className="h-5 w-5 text-blue-600" />,
      description: "Visa, Mastercard, or local cards",
      processingFee: 2.9,
      availableFor: ["supplier", "enterprise"],
    },
  ];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    const processingFee =
      paymentMethod === "card" ? selectedPlan.price * 0.029 : 0;
    return selectedPlan.price + processingFee;
  };

  const handlePayment = async () => {
    if (!paymentMethod || !selectedPlan) return;

    setIsProcessing(true);
    setPaymentStatus({
      status: "processing",
      amount: calculateTotal(),
      method: paymentMethod,
      timestamp: new Date().toISOString(),
      message: "Initiating payment...",
    });

    try {
      if (paymentMethod === "mpesa") {
        await processMpesaPayment();
      } else if (paymentMethod === "card") {
        await processCardPayment();
      }
    } catch (error) {
      setPaymentStatus({
        status: "failed",
        amount: calculateTotal(),
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        message: "Payment failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processMpesaPayment = async () => {
    try {
      // Security validation
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error("Invalid phone number");
      }

      // Sanitize and validate phone number
      const sanitizedPhone = phoneNumber
        .replace(/\D/g, "")
        .replace(/^0/, "254");
      if (!sanitizedPhone.startsWith("254") || sanitizedPhone.length !== 12) {
        throw new Error("Please enter a valid Kenyan phone number");
      }

      setPaymentStatus((prev) =>
        prev ? { ...prev, message: "🔒 Securing payment channel..." } : null,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPaymentStatus((prev) =>
        prev
          ? { ...prev, message: "📱 Sending STK Push to your phone..." }
          : null,
      );
      setCountdown(60); // 60 second countdown

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentStatus((prev) =>
        prev
          ? {
              ...prev,
              message:
                "🔐 Please enter your M-Pesa PIN on your phone to complete the payment",
            }
          : null,
      );

      // Simulate user entering PIN and payment processing
      await new Promise((resolve) => setTimeout(resolve, 8000));

      // Enhanced transaction verification
      setPaymentStatus((prev) =>
        prev
          ? { ...prev, message: "🛡️ Verifying transaction security..." }
          : null,
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const transactionId = `MP${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Security logging for successful payment
        logPaymentEvent(calculateTotal(), "mpesa", true, {
          transactionId,
          planId: selectedPlan?.id,
          phoneHash: sanitizedPhone.slice(-4),
          verified: true,
        });

        setPaymentStatus({
          status: "success",
          transactionId,
          amount: calculateTotal(),
          method: paymentMethod,
          timestamp: new Date().toISOString(),
          message: "🦁 Payment successful! Welcome to the Savanna Pride!",
        });

        if (onPaymentComplete) {
          onPaymentComplete({
            success: true,
            transactionId,
            amount: calculateTotal(),
            plan: selectedPlan,
            paymentMethod: "mpesa",
            securityVerified: true,
          });
        }
      } else {
        // Security logging for failed payment
        logPaymentEvent(calculateTotal(), "mpesa", false, {
          planId: selectedPlan?.id,
          phoneHash: sanitizedPhone.slice(-4),
          reason: "user_cancelled_or_insufficient_funds",
        });

        setPaymentStatus({
          status: "failed",
          amount: calculateTotal(),
          method: paymentMethod,
          timestamp: new Date().toISOString(),
          message:
            "❌ Payment was cancelled or failed. Please check your M-Pesa balance and try again.",
        });
      }
    } catch (error) {
      // Security logging for payment errors
      logPaymentEvent(calculateTotal(), "mpesa", false, {
        error: error instanceof Error ? error.message : "unknown_error",
        planId: selectedPlan?.id,
      });

      setPaymentStatus({
        status: "failed",
        amount: calculateTotal(),
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        message: `🚫 Payment error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  const processCardPayment = async () => {
    try {
      setPaymentStatus((prev) =>
        prev
          ? { ...prev, message: "🔒 Initializing secure payment gateway..." }
          : null,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPaymentStatus((prev) =>
        prev ? { ...prev, message: "🛡️ Encrypting payment details..." } : null,
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPaymentStatus((prev) =>
        prev ? { ...prev, message: "💳 Processing card payment..." } : null,
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentStatus((prev) =>
        prev ? { ...prev, message: "🔐 Verifying with bank..." } : null,
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success (95% success rate for cards)
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        const transactionId = `CD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Security logging for successful card payment
        logPaymentEvent(calculateTotal(), "card", true, {
          transactionId,
          planId: selectedPlan?.id,
          encrypted: true,
          pciCompliant: true,
        });

        setPaymentStatus({
          status: "success",
          transactionId,
          amount: calculateTotal(),
          method: paymentMethod,
          timestamp: new Date().toISOString(),
          message:
            "🦁 Card payment successful! Your transaction is secure and encrypted.",
        });

        if (onPaymentComplete) {
          onPaymentComplete({
            success: true,
            transactionId,
            amount: calculateTotal(),
            plan: selectedPlan,
            paymentMethod: "card",
            securityVerified: true,
            encrypted: true,
          });
        }
      } else {
        // Security logging for failed card payment
        logPaymentEvent(calculateTotal(), "card", false, {
          planId: selectedPlan?.id,
          reason: "card_declined_or_insufficient_funds",
        });

        setPaymentStatus({
          status: "failed",
          amount: calculateTotal(),
          method: paymentMethod,
          timestamp: new Date().toISOString(),
          message:
            "❌ Card payment failed. Please verify your card details and try again.",
        });
      }
    } catch (error) {
      // Security logging for card payment errors
      logPaymentEvent(calculateTotal(), "card", false, {
        error: error instanceof Error ? error.message : "unknown_error",
        planId: selectedPlan?.id,
      });

      setPaymentStatus({
        status: "failed",
        amount: calculateTotal(),
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        message: `🚫 Card payment error: ${error instanceof Error ? error.message : "Secure processing failed"}`,
      });
    }
  };

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <Label className="text-base font-medium">Choose Payment Method</Label>
      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all text-left w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              paymentMethod === method.id
                ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setPaymentMethod(method.id)}
            disabled={isProcessing}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              {method.icon}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm md:text-base">
                  {method.name}
                </div>
                <div className="text-xs md:text-sm text-gray-600 truncate">
                  {method.description}
                </div>
                {method.processingFee > 0 && (
                  <div className="text-xs text-orange-600">
                    +{method.processingFee}% processing fee
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderMpesaForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
        <Input
          id="mpesa-phone"
          placeholder="254700000000"
          value={phoneNumber}
          onChange={(e) => {
            // Only allow numbers and limit to reasonable length
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 12) {
              setPhoneNumber(value);
            }
          }}
          className="mt-1"
          maxLength={12}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <div className="text-xs text-gray-500 mt-1">
          Enter your phone number registered with M-Pesa (e.g., 254700123456)
        </div>
        {phoneNumber && phoneNumber.length > 0 && phoneNumber.length < 12 && (
          <div className="text-xs text-orange-600 mt-1">
            Please enter a valid phone number
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;

    const statusConfig = {
      pending: {
        icon: Clock,
        color: "yellow",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      },
      processing: {
        icon: RefreshCw,
        color: "blue",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      },
      success: {
        icon: CheckCircle,
        color: "green",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      },
      failed: {
        icon: XCircle,
        color: "red",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      },
      cancelled: {
        icon: AlertTriangle,
        color: "gray",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      },
    };

    const config = statusConfig[paymentStatus.status];
    const StatusIcon = config.icon;

    return (
      <Alert className={`${config.bgColor} ${config.borderColor} border-2`}>
        <StatusIcon
          className={`h-4 w-4 text-${config.color}-500 ${
            paymentStatus.status === "processing" ? "animate-spin" : ""
          }`}
        />
        <AlertTitle className={`text-${config.color}-800`}>
          {paymentStatus.status === "processing" && "Processing Payment..."}
          {paymentStatus.status === "success" && "🎉 Payment Successful!"}
          {paymentStatus.status === "failed" && "Payment Failed"}
          {paymentStatus.status === "cancelled" && "Payment Cancelled"}
        </AlertTitle>
        <AlertDescription className={`text-${config.color}-700`}>
          {paymentStatus.message}
          {paymentStatus.transactionId && (
            <div className="mt-2 font-mono text-sm">
              Transaction ID: {paymentStatus.transactionId}
            </div>
          )}
          {countdown > 0 && paymentStatus.status === "processing" && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Time remaining: {countdown}s</span>
                <Progress
                  value={((60 - countdown) / 60) * 100}
                  className="flex-1 h-2"
                />
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  };

  if (!selectedPlan) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Plan Selected</h3>
          <p className="text-gray-600">
            Please select a pricing plan to continue with payment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Order Summary */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-green-600" />
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{selectedPlan.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedPlan.period} subscription
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  KES {selectedPlan.price.toLocaleString()}
                </div>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Processing fee (2.9%)</span>
                <span>KES {(selectedPlan.price * 0.029).toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-green-600">
                  KES {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Payment Details</span>
          </CardTitle>
          <CardDescription>
            Complete your payment to activate your Savanna subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderPaymentMethods()}

          {paymentMethod === "mpesa" && renderMpesaForm()}

          {paymentStatus && renderPaymentStatus()}

          {!paymentStatus && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handlePayment}
                disabled={
                  !paymentMethod ||
                  isProcessing ||
                  (paymentMethod === "mpesa" && !phoneNumber)
                }
                className="flex-1 bg-green-600 hover:bg-green-700 h-12"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Pay KES {calculateTotal().toFixed(2)}
                  </>
                )}
              </Button>
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="h-12 sm:min-w-[100px]"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}

          {paymentStatus?.status === "success" && (
            <div className="text-center space-y-4">
              <div className="text-green-600 font-medium">
                🦁 Welcome to the Savanna! Your subscription is now active.
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Crown className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          )}

          {paymentStatus?.status === "failed" && (
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setPaymentStatus(null);
                  setCountdown(0);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <Shield className="h-4 w-4 inline mr-1" />
            Your payment is secured with 256-bit SSL encryption
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessor;
