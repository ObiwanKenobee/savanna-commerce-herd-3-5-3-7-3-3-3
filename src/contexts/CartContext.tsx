import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Product } from "@/hooks/useSupabaseData";
import { toast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  currency: string;
}

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: Cart };

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { totalItems, totalAmount };
};

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id,
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update existing item
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + quantity;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.unitPrice,
            };
          }
          return item;
        });
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          product,
          quantity,
          unitPrice: product.unit_price || 0,
          totalPrice: quantity * (product.unit_price || 0),
        };
        newItems = [...state.items, newItem];
      }

      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.productId,
      );
      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { productId },
        });
      }

      const newItems = state.items.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          };
        }
        return item;
      });

      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      };
    }

    case "CLEAR_CART": {
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        currency: "KES",
      };
    }

    case "LOAD_CART": {
      return action.payload;
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    currency: "KES",
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("savanna_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && parsedCart.items) {
          dispatch({ type: "LOAD_CART", payload: parsedCart });
          console.log(
            "🛒 Cart loaded from storage:",
            parsedCart.totalItems,
            "items",
          );
        }
      } catch (error) {
        console.error("❌ Error loading cart from localStorage:", error);
        localStorage.removeItem("savanna_cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.items.length >= 0) {
      localStorage.setItem("savanna_cart", JSON.stringify(cart));
      console.log(
        "💾 Cart saved:",
        cart.totalItems,
        "items, KES",
        cart.totalAmount.toLocaleString(),
      );
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    try {
      // Validation
      if (!product || !product.id) {
        toast({
          title: "Invalid product",
          description: "Product information is missing",
          variant: "destructive",
        });
        return;
      }

      if (quantity <= 0) {
        toast({
          title: "Invalid quantity",
          description: "Please select a valid quantity",
          variant: "destructive",
        });
        return;
      }

      const minOrder = product.minimum_order_quantity || 1;
      if (quantity < minOrder) {
        toast({
          title: "Minimum order not met",
          description: `Minimum order quantity is ${minOrder} ${product.unit_of_measure || "units"}`,
          variant: "destructive",
        });
        return;
      }

      dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
      console.log(`✅ Added to cart: ${quantity}x ${product.name}`);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast({
        title: "Error adding to cart",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      const item = cart.items.find((item) => item.id === productId);
      dispatch({ type: "REMOVE_ITEM", payload: { productId } });

      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.product.name} removed from cart`,
        });
        console.log(`🗑️ Removed from cart: ${item.product.name}`);
      }
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      toast({
        title: "Error removing item",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      const item = cart.items.find((item) => item.id === productId);
      if (!item) return;

      const minOrder = item.product.minimum_order_quantity || 1;

      if (quantity > 0 && quantity < minOrder) {
        toast({
          title: "Minimum order not met",
          description: `Minimum order quantity is ${minOrder} ${item.product.unit_of_measure || "units"}`,
          variant: "destructive",
        });
        return;
      }

      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
      console.log(`🔄 Updated quantity: ${item.product.name} -> ${quantity}`);
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
      toast({
        title: "Error updating quantity",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const clearCart = () => {
    try {
      const itemCount = cart.totalItems;
      dispatch({ type: "CLEAR_CART" });

      if (itemCount > 0) {
        toast({
          title: "Cart cleared",
          description: `Removed ${itemCount} items from cart`,
        });
        console.log(`🧹 Cart cleared: ${itemCount} items removed`);
      }
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      toast({
        title: "Error clearing cart",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return cart.items.find((item) => item.id === productId);
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
