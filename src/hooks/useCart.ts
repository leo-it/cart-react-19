import { useEffect, useState } from "react";

import { Product } from "../types/types";
import { useOptimistic } from "react";

type CartAction =
  | { type: "add"; product: Product }
  | { type: "update"; id: number; quantity: number }
  | { type: "remove"; id: number };

export const useCart = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [optimisticCart, setOptimisticCart] = useOptimistic(cart, (state, action: CartAction) => {
    switch (action.type) {
      case "add":
        const existingItem = state.find((item) => item.id === action.product.id);
        if (existingItem) {
          return state.map((item) =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + action.product.quantity }
              : item
          );
        }
        return [...state, action.product];

      case "update":
        return state.map((item) =>
          item.id === action.id ? { ...item, quantity: Math.max(action.quantity, 1) } : item
        );

      case "remove":
        return state.filter((item) => item.id !== action.id);

      default:
        return state;
    }
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setOptimisticCart({ type: "add", product });
    setCart((prev) => [...prev, product]);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setOptimisticCart({ type: "update", id, quantity });
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item))
    );
  };

  const removeItem = (id: number) => {
    setOptimisticCart({ type: "remove", id });
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = (): string => {
    return optimisticCart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return {
    cart: optimisticCart,
    addToCart,
    updateQuantity,
    removeItem,
    calculateTotal,
  };
};
