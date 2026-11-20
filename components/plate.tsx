"use client";

import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { photoUrl, type Dish } from "@/lib/menu";
import { EASE, MORPH } from "./motion";

export function PlatePhoto({ dish, sizes, priority }: { dish: Dish; sizes: string; priority?: boolean }) {
  return (
    <Image
      src={photoUrl(dish.photo)}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className="scale-[1.18] object-cover"
    />
  );
}

function PlateFace({ dish }: { dish: Dish }) {
  return (
    <span className="absolute inset-[9%] overflow-hidden rounded-full shadow-[inset_0_2px_10px_rgb(0_0_0/0.25)]">
      <PlatePhoto dish={dish} sizes="(max-width: 768px) 60vw, 360px" priority />
    </span>
  );
}

/** `instant` skips the fade, used when the plate hands over to or from the dialog. */
export type TrayPlateCustom = { instant: boolean };

const trayVariants: Variants = {
  enter: (c: TrayPlateCustom) => ({ opacity: c.instant ? 1 : 0 }),
  center: { opacity: 1, transition: { duration: 0.35 } },
  exit: (c: TrayPlateCustom) =>
    c.instant
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: 0, transition: { duration: 0.4, delay: 0.5, ease: EASE } },
};

/** A plate riding on the turning tray. Purely visual: clicks go to the FrontPlate above it. */
export function TrayPlate({ dish, custom }: { dish: Dish; custom: TrayPlateCustom }) {
  return (
    <motion.div
      custom={custom}
      variants={trayVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="plate relative aspect-square w-(--plate) rounded-full"
    >
      <PlateFace dish={dish} />
    </motion.div>
  );
}

/*
 * The click target for the dish at the front of the tray, and the element that morphs
 * into the dialog (shared layoutId). It lives outside the turning tray because layout
 * animations measure positions with ancestor rotations stripped out, which would send
 * the morph off-screen.
 *
 * Normally it is transparent and the tray plate shows through. While coming back from
 * the dialog (`morphing`) it draws the plate itself, then hands back to the tray.
 */
export function FrontPlate({
  dish,
  morphing,
  onOpen,
  onMorphDone,
}: {
  dish: Dish;
  morphing: boolean;
  onOpen: () => void;
  onMorphDone: () => void;
}) {
  return (
    <motion.button
      type="button"
      layoutId={`dish-${dish.id}`}
      transition={{ layout: { duration: MORPH, ease: EASE } }}
      style={{ borderRadius: "50%" }}
      onClick={onOpen}
      onLayoutAnimationComplete={onMorphDone}
      className={`relative block aspect-square w-(--plate) cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-cream ${
        morphing ? "plate" : ""
      }`}
      aria-label={`Xem chi tiết món ${dish.name}`}
    >
      {morphing && (
        <motion.span
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: MORPH * 0.6, duration: 0.35 } }}
        >
          <PlateFace dish={dish} />
        </motion.span>
      )}
    </motion.button>
  );
}
