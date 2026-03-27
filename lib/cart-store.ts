"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) => item.id === product.id && item.size === size
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          set({ items: [...items, { ...product, size, quantity }] });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.size === size)
          ),
        });
      },

      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        const updated = get().items.map((item) =>
          item.id === id && item.size === size ? { ...item, quantity } : item
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "hypsoul-cart",
    }
  )
);
