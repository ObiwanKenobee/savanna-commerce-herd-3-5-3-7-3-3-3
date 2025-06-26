import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart`,
    });
  };

  const handleClearCart = () => {
    if (cart.totalItems > 0) {
      clearCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    }
  };

  const handleCheckout = () => {
    if (cart.totalItems === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    console.log("🛒 Proceeding to checkout with:", cart);
    toast({
      title: "Proceeding to checkout! 🚀",
      description: `Processing ${cart.totalItems} items worth KES ${cart.totalAmount.toLocaleString()}`,
    });

    // Simulate checkout process
    setTimeout(() => {
      navigate("/billing");
    }, 1500);
  };

  const shipping = cart.totalAmount > 5000 ? 0 : 300; // Free shipping over KES 5,000
  const tax = Math.round(cart.totalAmount * 0.16); // 16% VAT
  const total = cart.totalAmount + shipping + tax;

  if (cart.totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <EnterpriseNavigation />

        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-20">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">
                Start adding some amazing products from our marketplace!
              </p>
              <div className="space-y-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Link to="/marketplace">
                    <Package className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link to="/group-buying">
                    <span className="text-lg mr-2">🤝</span>
                    Join Group Buying
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <EnterpriseFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <EnterpriseNavigation />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/marketplace">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">🛒 Shopping Cart</h1>
                <p className="text-gray-600">
                  {cart.totalItems} items in your cart
                </p>
              </div>
            </div>

            {cart.totalItems > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-green-600" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {item.product.supplier?.name || "Local Supplier"}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">
                            {item.product.category}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {item.product.unit_of_measure}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          KES {item.unitPrice.toLocaleString()} per{" "}
                          {item.product.unit_of_measure}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-16 h-8 text-center"
                            min="1"
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-gray-600">Total</div>
                          <div className="font-bold text-green-600">
                            KES {item.totalPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveItem(item.id, item.product.name)
                        }
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span>KES {cart.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="flex items-center space-x-1">
                        <Truck className="h-4 w-4" />
                        <span>Shipping</span>
                      </span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600 font-medium">
                            FREE
                          </span>
                        ) : (
                          `KES ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>

                    {shipping === 0 && (
                      <div className="text-xs text-green-600 flex items-center space-x-1">
                        <span>🎉</span>
                        <span>You qualified for free shipping!</span>
                      </div>
                    )}

                    {cart.totalAmount < 5000 && (
                      <div className="text-xs text-blue-600 flex items-center space-x-1">
                        <span>💡</span>
                        <span>
                          Add KES {(5000 - cart.totalAmount).toLocaleString()}{" "}
                          more for free shipping
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>VAT (16%)</span>
                      <span>KES {tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">
                      KES {total.toLocaleString()}
                    </span>
                  </div>

                  {/* Payment Methods Preview */}
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Payment Options:</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold">
                          MP
                        </div>
                        <span>M-Pesa</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                          💳
                        </div>
                        <span>Cards</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs">
                          💧
                        </div>
                        <span>BNPL</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <div className="text-xs text-gray-500 text-center flex items-center justify-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Secure checkout powered by M-Pesa</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default Cart;
