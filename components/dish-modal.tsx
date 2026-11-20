"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { formatPrice, type Dish } from "@/lib/menu";
import { BagIcon, ClockIcon, CloseIcon, MinusIcon, PlusIcon, UserIcon } from "./icons";
import { EASE, MORPH } from "./motion";
import { PlatePhoto } from "./plate";
import { useDialog } from "./use-dialog";

type Props = {
  dish: Dish;
  onClose: () => void;
  onAdd: (qty: number) => void;
};

const content = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay: MORPH * 0.75, duration: 0.4, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export function DishModal({ dish, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialog(onClose, closeRef);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-[#4a5245]/35 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {/* Same layoutId as the plate: the plate grows into this card and shrinks back on close. */}
      <motion.div
        layoutId={`dish-${dish.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-title"
        style={{ borderRadius: 28 }}
        transition={{ layout: { duration: MORPH, ease: EASE } }}
        exit={{ opacity: 0, transition: { duration: 0 } }}
        className="relative max-h-[92dvh] w-full max-w-[540px] overflow-hidden bg-paper shadow-[0_40px_80px_-30px_rgb(30_20_10/0.55)]"
      >
        {/* The plate photo fades out as the circle opens up */}
        <motion.span
          aria-hidden
          className="plate-food pointer-events-none absolute inset-[12%] overflow-hidden rounded-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { duration: MORPH * 0.45 } }}
        >
          <PlatePhoto dish={dish} sizes="360px" />
        </motion.span>

        <motion.div {...content} className="relative max-h-[92dvh] overflow-y-auto px-6 pt-6 pb-5 sm:px-8 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <p className="eyebrow pt-2">
              {dish.category} · {dish.mood}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="-mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-full border border-ink/60 transition-colors hover:bg-tile"
              aria-label="Đóng"
            >
              <CloseIcon width={16} height={16} />
            </button>
          </div>

          <h2 id="dish-title" className="mt-1 font-serif text-[40px] leading-[1.05] font-medium">
            {dish.name}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{dish.description}</p>

          <hr className="my-5 border-line" />

          <p className="text-[11px] font-medium text-ink/80">Nguyên liệu nổi bật</p>
          <ul className="mt-3 grid grid-cols-2 gap-2.5">
            {dish.ingredients.map((ing) => (
              <li key={ing.name} className="flex items-center gap-3 rounded-xl bg-tile px-3 py-3">
                <span className="grid size-9 place-items-center rounded-full bg-paper text-[18px]" aria-hidden>
                  {ing.icon}
                </span>
                <span className="text-[12px]">{ing.name}</span>
              </li>
            ))}
          </ul>

          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-tile px-3 py-3">
              <p className="flex items-center gap-1.5 text-[10px] text-muted">
                <ClockIcon width={12} height={12} /> Thời gian chuẩn bị
              </p>
              <p className="mt-1 text-[13px] font-medium">{dish.time}</p>
            </div>
            <div className="rounded-xl bg-tile px-3 py-3">
              <p className="flex items-center gap-1.5 text-[10px] text-muted">
                <UserIcon width={12} height={12} /> Khẩu phần
              </p>
              <p className="mt-1 text-[13px] font-medium">{dish.serving}</p>
            </div>
          </div>

          <hr className="my-5 border-line" />

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] text-muted">Giá / phần</p>
              <p className="font-serif text-[30px] leading-none font-semibold">{formatPrice(dish.price)}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 items-center rounded-full border border-line" role="group" aria-label="Số lượng">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid size-11 place-items-center text-muted hover:text-ink disabled:opacity-40"
                  disabled={qty <= 1}
                  aria-label="Bớt một phần"
                >
                  <MinusIcon width={14} height={14} />
                </button>
                <span className="w-5 text-center text-[14px] tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="grid size-11 place-items-center text-muted hover:text-ink"
                  aria-label="Thêm một phần"
                >
                  <PlusIcon width={14} height={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onAdd(qty)}
                className="flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[13px] font-medium text-paper transition-colors hover:bg-accent-strong"
              >
                <BagIcon width={16} height={16} />
                {qty > 1 ? `Thêm · ${formatPrice(dish.price * qty)}` : "Đặt hàng"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
