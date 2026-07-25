"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { PRODUCT_CATALOG, roundCurrency } from "./cartModel";
import type { CartLine, FlashOffer, JarCount, ProductId } from "./cartModel";

export { buildFlashOffers, PRODUCT_CATALOG, roundCurrency } from "./cartModel";
export type { CartLine, FlashOffer, JarCount, ProductId } from "./cartModel";

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  cartOpen: boolean;
  addRegularItem: (productId: ProductId, jars: JarCount) => void;
  addFlashOffer: (offer: FlashOffer) => void;
  setLineQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cata-kor-cart-v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const orderRef = useRef(0);

  useEffect(() => {
    let savedItems: CartLine[] = [];
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartLine[];
        if (Array.isArray(parsed)) savedItems = parsed;
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    const hydrationTimer = window.setTimeout(() => {
      setItems(savedItems);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const nextOrder = () => Date.now() + orderRef.current++ / 1000;

  const addRegularItem = (productId: ProductId, jars: JarCount) => {
    const pack = PRODUCT_CATALOG[productId].packs[jars];
    const id = `${productId}-${jars}-regular`;

    setItems((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) =>
          line.id === id
            ? { ...line, quantity: line.quantity + 1, updatedAt: nextOrder() }
            : line,
        );
      }
      return [
        ...current,
        {
          id,
          productId,
          jars,
          quantity: 1,
          price: pack.total,
          originalPrice: pack.total,
          isFlashSale: false,
          updatedAt: nextOrder(),
        },
      ];
    });
  };

  const addFlashOffer = (offer: FlashOffer) => {
    setItems((current) => {
      const existing = current.find((line) => line.id === offer.id);
      if (existing) {
        return current.map((line) =>
          line.id === offer.id
            ? { ...line, quantity: line.quantity + 1, updatedAt: nextOrder() }
            : line,
        );
      }
      return [
        ...current,
        {
          id: offer.id,
          productId: offer.productId,
          jars: offer.jars,
          quantity: 1,
          price: offer.salePrice,
          originalPrice: offer.originalPrice,
          isFlashSale: true,
          discountPercent: offer.discountPercent,
          sourceProductId: offer.sourceProductId,
          updatedAt: nextOrder(),
        },
      ];
    });
  };

  const setLineQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((line) => line.id !== id));
      return;
    }
    setItems((current) =>
      current.map((line) => (line.id === id ? { ...line, quantity, updatedAt: nextOrder() } : line)),
    );
  };

  const value: CartContextValue = {
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: roundCurrency(
      items.reduce((total, item) => total + item.price * item.quantity, 0),
    ),
    cartOpen,
    addRegularItem,
    addFlashOffer,
    setLineQuantity,
    removeLine: (id) => setItems((current) => current.filter((line) => line.id !== id)),
    clearCart: () => setItems([]),
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
