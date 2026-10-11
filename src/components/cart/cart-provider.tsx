"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface CartItem { birdId: string; quantity: number }
interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (birdId: string, maxQuantity?: number) => void;
  updateQuantity: (birdId: string, quantity: number, maxQuantity?: number) => void;
  removeItem: (birdId: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "parrot-house-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children, userId }: { children: React.ReactNode; userId: string | null }) {
  return <CartStateProvider key={userId ?? "guest"} userId={userId}>{children}</CartStateProvider>;
}

function CartStateProvider({ children, userId }: { children: React.ReactNode; userId: string | null }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const storageKey = userId ? `${STORAGE_KEY}:${userId}` : null;

  useEffect(() => {
    if (!storageKey) {
      clearStoredCarts();
      return;
    }

    const frame = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setItems(parseStoredItems(saved));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [storageKey]);

  useEffect(() => {
    if (storageKey && ready) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, ready, storageKey]);

  useEffect(() => {
    if (!storageKey) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== storageKey) return;
      try {
        setItems(event.newValue ? parseStoredItems(event.newValue) : []);
      } catch {
        setItems([]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    addItem: (birdId, maxQuantity = 99) => setItems((current) => {
      if (!userId) return current;
      const existing = current.find((item) => item.birdId === birdId);
      if (!existing) return [...current, { birdId, quantity: 1 }];
      return current.map((item) => item.birdId === birdId ? { ...item, quantity: Math.min(item.quantity + 1, maxQuantity) } : item);
    }),
    updateQuantity: (birdId, quantity, maxQuantity = 99) => setItems((current) => userId ? current.map((item) => item.birdId === birdId ? { ...item, quantity: Math.max(1, Math.min(quantity, maxQuantity)) } : item) : current),
    removeItem: (birdId) => setItems((current) => userId ? current.filter((item) => item.birdId !== birdId) : current),
    clear: () => setItems([]),
  }), [items, userId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

export function clearStoredCarts() {
  if (typeof window === "undefined") return;
  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index);
    if (key === STORAGE_KEY || key?.startsWith(`${STORAGE_KEY}:`)) {
      window.localStorage.removeItem(key);
    }
  }
}

function parseStoredItems(value: string): CartItem[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  return parsed.filter((item): item is CartItem => {
    if (!item || typeof item !== "object") return false;
    const birdId = "birdId" in item ? item.birdId : undefined;
    const quantity = "quantity" in item ? item.quantity : undefined;
    return typeof birdId === "string" && typeof quantity === "number" && Number.isInteger(quantity) && quantity > 0;
  });
}
