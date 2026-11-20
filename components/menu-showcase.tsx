"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { dishes, formatPrice } from "@/lib/menu";
import { CartDrawer } from "./cart-drawer";
import { DishCarousel } from "./dish-carousel";
import { DishModal } from "./dish-modal";
import { Header } from "./header";
import { BagIcon, ClockIcon, ShuffleIcon } from "./icons";
import { EASE } from "./motion";
import { Tray } from "./tray";
import { useCart } from "./use-cart";

export function MenuShowcase() {
  const [index, setIndex] = useState(0);
  // Position of the tray: +1 for every step forward, -1 back. Never wraps, so the
  // tray keeps turning the same way past the end of the menu.
  const [slot, setSlot] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  // True while the plate is morphing back from the dialog onto the tray.
  const [returning, setReturning] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cart = useCart();
  const dish = dishes[index];

  const select = useCallback(
    (next: number, direction?: number) => {
      const n = (next + dishes.length) % dishes.length;
      if (n === index) return;
      setSlot((s) => s + (direction ?? (n > index ? 1 : -1)));
      setReturning(false);
      setIndex(n);
    },
    [index],
  );

  const openModal = () => setModalOpen(true);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setReturning(true);
  }, []);
  const onReturned = useCallback(() => setReturning(false), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const random = () => {
    const others = dishes.map((_, i) => i).filter((i) => i !== index);
    select(others[Math.floor(Math.random() * others.length)]);
  };

  const addToCart = (qty: number) => {
    cart.add(dish.id, qty);
    closeModal();
    setToast(`Đã thêm ${qty} × ${dish.name}`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  // Arrow keys flip through the menu when nothing is open on top.
  useEffect(() => {
    if (modalOpen || cartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element | null)?.closest?.("input, textarea")) return;
      if (e.key === "ArrowRight") select(index + 1, 1);
      if (e.key === "ArrowLeft") select(index - 1, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, modalOpen, cartOpen, select]);

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative flex min-h-dvh flex-col overflow-x-clip"
        style={{ "--plate": "clamp(210px, min(21vw, 33vh), 360px)" } as CSSProperties}
      >
        <Header count={cart.count} onCart={() => setCartOpen(true)} />

        {/* Table with the plate */}
        <section className="relative h-[calc(var(--plate)*0.92)] max-md:[--plate:min(64vw,300px)]">
          <Tray
            dish={dish}
            slot={slot}
            modalOpen={modalOpen}
            returning={returning}
            onOpen={openModal}
            onReturned={onReturned}
          />

          <div className="absolute top-[34%] left-[6vw] hidden md:block">
            <p className="font-serif text-[clamp(26px,2.3vw,34px)] leading-[1.15]">
              Ngon từ
              <br />
              điều giản dị.
            </p>
            <p className="mt-4 text-[9px] leading-[1.9] tracking-[0.26em] text-muted uppercase">
              Nguyên liệu tươi —
              <br />
              hương vị tròn vẹn
            </p>
          </div>

          <button
            type="button"
            onClick={random}
            className="group absolute top-[42%] right-[6vw] hidden items-center gap-3 text-left md:flex"
          >
            <span className="grid size-9 place-items-center rounded-full border border-line text-muted transition-transform duration-500 group-hover:rotate-180 group-hover:text-ink">
              <ShuffleIcon width={15} height={15} />
            </span>
            <span className="text-[10px] leading-snug text-muted">
              Chưa biết ăn gì?
              <br />
              <span className="text-ink underline decoration-line underline-offset-4">Để bàn chọn giúp</span>
            </span>
          </button>

        </section>

        {/* Dish details */}
        <section className="relative px-5 pt-[calc(var(--plate)*0.2+30px)] text-center max-md:[--plate:min(64vw,300px)]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.42, ease: EASE }}
            >
              <p className="eyebrow">
                {dish.category} · {dish.mood}
              </p>
              <h1 className="mt-3 font-serif text-[clamp(42px,5.4vw,78px)] leading-[1.02] font-medium">{dish.name}</h1>
              <p className="mx-auto mt-3 max-w-[460px] text-[13px] leading-relaxed text-muted">{dish.description}</p>

              <div className="mt-5 flex items-center justify-center gap-4 text-[12px] text-muted">
                <span className="font-serif text-[26px] leading-none font-semibold text-ink">{formatPrice(dish.price)}</span>
                <span className="h-4 w-px bg-line" />
                <span className="flex items-center gap-1.5">
                  <ClockIcon width={13} height={13} /> {dish.time}
                </span>
                <span>· {dish.serving}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted">{dish.tags.join("  ·  ")}</p>

              <div className="mt-5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={openModal}
                  className="flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-[12px] font-medium text-paper transition-colors hover:bg-accent-strong"
                >
                  <BagIcon width={15} height={15} /> Chọn món này
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="mx-auto mt-auto w-full max-w-[1180px] px-5 pt-10 pb-7 md:px-10">
          <DishCarousel dishes={dishes} active={index} onSelect={(i) => select(i)} />
        </div>

        <AnimatePresence>
          {modalOpen && <DishModal key="dish" dish={dish} onClose={closeModal} onAdd={addToCart} />}
        </AnimatePresence>

        <AnimatePresence>{cartOpen && <CartDrawer key="cart" cart={cart} onClose={closeCart} />}</AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.button
              type="button"
              onClick={() => {
                setToast(null);
                setCartOpen(true);
              }}
              initial={{ opacity: 0, y: 16, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 16, x: "-50%" }}
              className="fixed bottom-6 left-1/2 z-40 flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-[12px] text-paper shadow-lg"
            >
              {toast}
              <span className="text-paper/60 underline underline-offset-4">Xem giỏ</span>
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
