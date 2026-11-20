"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatPrice, photoUrl, type Dish } from "@/lib/menu";
import { ChevronLeft, ChevronRight } from "./icons";
import { EASE } from "./motion";

const PER_PAGE = 4;
const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  dishes: Dish[];
  active: number;
  onSelect: (index: number) => void;
};

function Card({ dish, active, onClick }: { dish: Dish; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors duration-300 ${
        active
          ? "border-transparent bg-selected"
          : "border-line/80 bg-paper/70 hover:border-line hover:bg-paper"
      }`}
    >
      <span className="plate relative size-14 shrink-0 overflow-hidden rounded-full">
        <span className="absolute inset-[10%] overflow-hidden rounded-full">
          <Image src={photoUrl(dish.photo, 200)} alt="" fill sizes="56px" className="scale-[1.18] object-cover" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-[17px] leading-tight font-medium">{dish.name}</span>
        <span className="mt-1 block text-[11px] text-muted">{formatPrice(dish.price)}</span>
      </span>
    </button>
  );
}

export function DishCarousel({ dishes, active, onSelect }: Props) {
  const pages = Math.ceil(dishes.length / PER_PAGE);
  const [page, setPage] = useState(Math.floor(active / PER_PAGE));
  const [dir, setDir] = useState(1);

  // Follow the selected dish when it changes from elsewhere (arrows, random pick).
  const [lastActive, setLastActive] = useState(active);
  if (active !== lastActive) {
    setLastActive(active);
    const target = Math.floor(active / PER_PAGE);
    if (target !== page) {
      setDir(target > page ? 1 : -1);
      setPage(target);
    }
  }

  const go = (d: number) => {
    setDir(d);
    setPage((p) => (p + d + pages) % pages);
  };

  // Mobile: keep the active card in view inside the scroll strip.
  const stripRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = stripRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const visible = dishes.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section aria-label="Thực đơn" className="w-full">
      <div className="flex items-end justify-between px-1">
        <p className="text-[12px] text-muted">
          Hôm nay, bạn muốn <span className="font-medium text-ink">thưởng thức gì?</span>
        </p>
        <p className="eyebrow hidden md:block">
          Trang {pad(page + 1)} / {pad(pages)}
        </p>
      </div>

      {/* Desktop: paged grid */}
      <div className="mt-3 hidden items-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => go(-1)}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-paper/70 text-muted transition-colors hover:text-ink"
          aria-label="Trang trước"
        >
          <ChevronLeft width={16} height={16} />
        </button>
        <div className="relative flex-1 overflow-hidden p-0.5">
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.ul
              key={page}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: `${d * 40}%`, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: `${d * -40}%`, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: EASE }}
              className="grid grid-cols-4 gap-3"
            >
              {visible.map((d) => {
                const i = dishes.indexOf(d);
                return (
                  <li key={d.id}>
                    <Card dish={d} active={i === active} onClick={() => onSelect(i)} />
                  </li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-paper/70 text-muted transition-colors hover:text-ink"
          aria-label="Trang sau"
        >
          <ChevronRight width={16} height={16} />
        </button>
      </div>

      <div className="mt-4 hidden justify-center gap-1.5 md:flex" aria-hidden>
        {Array.from({ length: pages }, (_, i) => (
          <span
            key={i}
            className={`h-[3px] rounded-full transition-all duration-500 ${i === page ? "w-6 bg-ink/70" : "w-2 bg-line"}`}
          />
        ))}
      </div>

      {/* Mobile: swipeable strip with every dish */}
      <ul ref={stripRef} className="no-scrollbar -mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 md:hidden">
        {dishes.map((d, i) => (
          <li key={d.id} className="w-[64%] shrink-0 snap-center">
            <Card dish={d} active={i === active} onClick={() => onSelect(i)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
