import { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "@/hooks/useAuth";
import { Cart } from "@/contexts/CartContext";
import {
  paymentService,
  PAYMENT_PROVIDERS,
  PaymentProvider,
} from "@/lib/paymentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  CreditCard,
  Smartphone,
  Building2,
  Globe,
  Shield,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Loader2,
} from "lucide-react";

interface PaymentFlowProps {
  cart: Cart;
  finalTotal: number;
  shippingCost: number;
  taxAmount: number;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
}

interface PaymentData {
  provider: PaymentProvider;
  method: string;
  details: Record<string, any>;
}

const StripePaymentForm = ({ amount, onSuccess, onError }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        onError(error.message);
        return;
      }

      // Process payment through our service
      const result = await paymentService.processPayment(
        PAYMENT_PROVIDERS.find((p) => p.id === "stripe")!,
        {
          amount,
          currency: "KES",
          orderId: `order_${Date.now()}`,
          customerId: "customer_id",
          description: "Savanna Marketplace Order",
        },
        paymentMethod,
      );

      if (result.success) {
        onSuccess(result.transactionId);
      } else {
        onError(result.error);
      }
    } catch (error: any) {
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay KSH {amount.toLocaleString()}
          </>
        )}
      </Button>
    </form>
  );
};

const MpesaPaymentForm = ({ amount, onSuccess, onError }: any) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      const result = await paymentService.processPayment(
        PAYMENT_PROVIDERS.find((p) => p.id === "mpesa")!,
        {
          amount,
          currency: "KES",
          orderId: `order_${Date.now()}`,
          customerId: phoneNumber,
          description: "Savanna Marketplace Order",
        },
        { phoneNumber },
      );

      if (result.success) {
        toast({
          title: "Payment Request Sent",
          description: "Please check your phone to complete the M-Pesa payment",
        });
        onSuccess(result.transactionId);
      } else {
        onError(result.error);
      }
    } catch (error: any) {
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
        <Input
          id="mpesa-phone"
          type="tel"
          placeholder="254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Enter your M-Pesa registered phone number
        </p>
      </div>

      <Button
        type="submit"
        disabled={!phoneNumber || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending Request...
          </>
        ) : (
          <>
            <Smartphone className="h-4 w-4 mr-2" />
            Pay KSH {amount.toLocaleString()} via M-Pesa
          </>
        )}
      </Button>
    </form>
  );
};

export const PaymentFlow = ({
  cart,
  finalTotal,
  shippingCost,
  taxAmount,
  onSuccess,
  onCancel,
}: PaymentFlowProps) => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState("shipping");
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProvider | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    region: "",
    country: "Kenya",
    postalCode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const availableProviders = paymentService.getAvailableProviders(
    shippingAddress.country,
    cart.currency,
  );

  const handlePaymentSuccess = async (transactionId: string) => {
    setIsProcessing(true);

    try {
      // Create order in database
      const orderData = {
        cart,
        shippingAddress,
        paymentDetails: {
          provider: selectedProvider?.id,
          transactionId,
          amount: finalTotal,
        },
        totalAmount: finalTotal,
        shippingCost,
        taxAmount,
      };

      // TODO: Call API to create order
      // const order = await createOrder(orderData);

      toast({
        title: "Order Created Successfully",
        description: `Your order has been created with transaction ID: ${transactionId}`,
      });

      onSuccess(transactionId);
    } catch (error: any) {
      toast({
        title: "Order Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {["shipping", "payment", "review"].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step
                  ? "bg-primary text-primary-foreground"
                  : index <
                      ["shipping", "payment", "review"].indexOf(currentStep)
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                currentStep === step ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
            {index < 2 && <div className="w-8 h-px bg-muted mx-4" />}
          </div>
        ))}
      </div>

      <Tabs value={currentStep} onValueChange={setCurrentStep}>
        {/* Shipping Information */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={shippingAddress.country}
                    onValueChange={(value) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        country: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Rwanda">Rwanda</SelectItem>
                      <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Street address, building, apartment"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="region">Region/State</Label>
                  <Input
                    id="region"
                    value={shippingAddress.region}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        region: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={() => setCurrentStep("payment")}>
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Provider Selection */}
                  <div>
                    <Label className="text-base font-medium">
                      Choose Payment Provider
                    </Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {availableProviders.map((provider) => (
                        <Card
                          key={provider.id}
                          className={`cursor-pointer transition-all ${
                            selectedProvider?.id === provider.id
                              ? "ring-2 ring-primary border-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedProvider(provider)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                              {provider.id === "stripe" && (
                                <CreditCard className="h-6 w-6" />
                              )}
                              {provider.id === "mpesa" && (
                                <Smartphone className="h-6 w-6" />
                              )}
                              {provider.id === "paypal" && (
                                <Globe className="h-6 w-6" />
                              )}
                              {provider.id === "paystack" && (
                                <Building2 className="h-6 w-6" />
                              )}
                            </div>
                            <div className="font-medium text-sm">
                              {provider.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {provider.fees.percentage}% fee
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Payment Forms */}
                  {selectedProvider && (
                    <div className="space-y-4">
                      <Separator />

                      {selectedProvider.id === "stripe" && (
                        <Elements stripe={null}>
                          <StripePaymentForm
                            amount={finalTotal}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                          />
                        </Elements>
                      )}

                      {selectedProvider.id === "mpesa" && (
                        <MpesaPaymentForm
                          amount={finalTotal}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      )}

                      {selectedProvider.id === "paypal" && (
                        <PayPalScriptProvider
                          options={{
                            "client-id":
                              process.env.VITE_PAYPAL_CLIENT_ID || "",
                            currency: "USD",
                          }}
                        >
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: (finalTotal / 140).toFixed(2), // Convert KES to USD
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={async (data, actions) => {
                              const details = await actions.order?.capture();
                              if (details?.id) {
                                handlePaymentSuccess(details.id);
                              }
                            }}
                            onError={(err) => {
                              handlePaymentError("PayPal payment failed");
                            }}
                          />
                        </PayPalScriptProvider>
                      )}

                      {selectedProvider.id === "paystack" && (
                        <Button
                          className="w-full"
                          onClick={() => {
                            // Redirect to Paystack
                            window.open("https://paystack.com/pay", "_blank");
                          }}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Pay with Paystack
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span>KSH {cart.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>KSH {shippingCost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>VAT (16%)</span>
                      <span>KSH {taxAmount.toLocaleString()}</span>
                    </div>

                    {selectedProvider && (
                      <div className="flex justify-between text-sm">
                        <span>Payment Fee</span>
                        <span>
                          KSH{" "}
                          {paymentService
                            .calculateFees(finalTotal, selectedProvider)
                            .toLocaleString()}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>KSH {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      Secure SSL encrypted payment
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3" />
                      Free returns within 30 days
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep("shipping")}
            >
              Back to Shipping
            </Button>
            <Button
              onClick={() => setCurrentStep("review")}
              disabled={!selectedProvider}
            >
              Review Order
            </Button>
          </div>
        </TabsContent>

        {/* Order Review */}
        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shipping Address Summary */}
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <div className="text-sm text-muted-foreground">
                  <div>{shippingAddress.fullName}</div>
                  <div>{shippingAddress.address}</div>
                  <div>
                    {shippingAddress.city}, {shippingAddress.region}{" "}
                    {shippingAddress.postalCode}
                  </div>
                  <div>{shippingAddress.country}</div>
                  <div>{shippingAddress.phone}</div>
                </div>
              </div>

              {/* Payment Method Summary */}
              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="flex items-center gap-2">
                  {selectedProvider && (
                    <>
                      <Badge variant="outline">{selectedProvider.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedProvider.fees.percentage}% processing fee
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>KSH {item.totalPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("payment")}
                >
                  Back to Payment
                </Button>
                <Button
                  onClick={() =>
                    handlePaymentSuccess("demo_transaction_" + Date.now())
                  }
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
