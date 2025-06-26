import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingCart as CartIcon,
  Plus,
  Minus,
  Trash2,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  ArrowRight,
} from "lucide-react";
import { PaymentFlow } from "./PaymentFlow";

interface ShoppingCartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ShoppingCart = ({ isOpen, onClose }: ShoppingCartProps) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);

  const shippingCost = cart.totalAmount > 50000 ? 0 : 2500; // Free shipping over KSH 50,000
  const taxRate = 0.16; // 16% VAT
  const taxAmount = cart.totalAmount * taxRate;
  const finalTotal = cart.totalAmount + shippingCost + taxAmount;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      // Handle authentication
      return;
    }
    setShowPayment(true);
  };

  if (cart.items.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CartIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-4">
            Start shopping to add products to your cart
          </p>
          <Button onClick={onClose}>Continue Shopping</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CartIcon className="h-5 w-5" />
            Shopping Cart ({cart.totalItems} items)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-300" />
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {item.product.category}
                      </Badge>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.product.supplier?.name}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock_quantity}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      {item.product.unit_of_measure}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">
                      KSH {item.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @ KSH {item.unitPrice.toLocaleString()}/
                      {item.product.unit_of_measure}
                    </div>
                  </div>
                </div>

                {/* Stock warning */}
                {item.quantity > item.product.stock_quantity * 0.8 && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                    Only {item.product.stock_quantity - item.quantity} units
                    left in stock
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Subtotal</div>
              <div className="font-bold text-lg">
                KSH {cart.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KSH {cart.totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping
                {shippingCost === 0 && (
                  <Badge variant="secondary" className="text-xs">
                    FREE
                  </Badge>
                )}
              </span>
              <span>KSH {shippingCost.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>VAT (16%)</span>
              <span>KSH {taxAmount.toLocaleString()}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>KSH {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Secure payment protected by SSL encryption
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Free shipping on orders over KSH 50,000
            </div>
          </div>

          <div className="space-y-2">
            {!user ? (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Please sign in to continue with checkout
                </p>
                <Button className="w-full">Sign In to Checkout</Button>
              </div>
            ) : (
              <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Complete Your Order</DialogTitle>
                  </DialogHeader>
                  <PaymentFlow
                    cart={cart}
                    finalTotal={finalTotal}
                    shippingCost={shippingCost}
                    taxAmount={taxAmount}
                    onSuccess={() => {
                      setShowPayment(false);
                      clearCart();
                      // Navigate to order confirmation
                    }}
                    onCancel={() => setShowPayment(false)}
                  />
                </DialogContent>
              </Dialog>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
