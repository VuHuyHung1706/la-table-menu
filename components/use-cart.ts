"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { dishes, DELIVERY_FEE, FREE_DELIVERY_FROM, type Dish } from "@/lib/menu";

type Lines = Record<string, number>;
const KEY = "la-table-cart";

export type CartLine = { dish: Dish; qty: number };

export function useCart() {
  const [lines, setLines] = useState<Lines>({});
  // Don't write to storage until the saved cart has been read back, or the empty
  // initial state would overwrite it.
  const [restored, setRestored] = useState(false);

  // Restore the cart after hydration so server and client render the same first frame.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Lines;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off restore from storage
      setLines(saved);
    } catch {
      /* storage unavailable: start empty */
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, restored]);

  const add = useCallback((id: string, qty: number) => {
    setLines((l) => ({ ...l, [id]: Math.min(99, (l[id] ?? 0) + qty) }));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((l) => {
      const next = { ...l };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(99, qty);
      return next;
    });
  }, []);

  const clear = useCallback(() => setLines({}), []);

  const items: CartLine[] = useMemo(
    () => dishes.filter((d) => lines[d.id]).map((dish) => ({ dish, qty: lines[dish.id] })),
    [lines],
  );
  const count = items.reduce((s, l) => s + l.qty, 0);
  const subtotal = items.reduce((s, l) => s + l.qty * l.dish.price, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;

  return { items, count, subtotal, delivery, total: subtotal + delivery, add, setQty, clear };
}
