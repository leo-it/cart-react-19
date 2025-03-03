// src/hooks/useCart.ts

import { useEffect, useState } from "react";

import { Product } from "../types/types";

export const useCart = () => {
  const [cart, setCart] = useState<Product[]>([]);

  // Cargar el carrito desde localStorage solo si existe algo
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Agregar un producto al carrito
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, product];
    });
  };

  // Actualizar la cantidad de un producto en el carrito
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  // Eliminar un producto del carrito
  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  // Calcular el total del carrito
  const calculateTotal = (): string => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    calculateTotal,
  };
};
