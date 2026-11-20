"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue, type Variants } from "motion/react";
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
      style={{ scale: dish.zoom ?? 1.32 }}
      className="object-cover"
    />
  );
}

/**
 * The food and the well it sits in. `spin` turns only the food: the plate's glaze,
 * glints and shadows stay put because the light in the room doesn't move.
 */
function PlateFace({ dish, spin }: { dish: Dish; spin?: MotionValue<number> }) {
  return (
    <>
      <span className="plate-food absolute inset-[12%] overflow-hidden rounded-full">
        <motion.span className="absolute inset-0" style={{ rotate: spin }}>
          <PlatePhoto dish={dish} sizes="(max-width: 768px) 60vw, 360px" priority />
        </motion.span>
      </span>
      <span className="plate-well pointer-events-none absolute inset-[12%] rounded-full" />
    </>
  );
}

/** `instant` hands the plate over to or from the dialog without waiting for the tray. */
export type TrayPlateCustom = { instant: boolean };

/** How long the tray takes to carry one plate away and bring the next one round. */
export const TURN_DURATION = 1.25;

// Plates never fade on the tray: the outgoing one stays solid while the tray carries it
// up and over the top edge, where it is clipped out of sight. The exit just keeps it
// mounted until the turn has finished.
const trayVariants: Variants = {
  enter: { opacity: 1 },
  exit: (c: TrayPlateCustom) =>
    c.instant
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: [1, 1, 0], transition: { duration: TURN_DURATION, times: [0, 0.98, 1] } },
};

/**
 * A plate riding on the turning tray. Purely visual: clicks go to the FrontPlate above it.
 * `turn` is how far the plate has been carried round (tray angle + its slot angle); the
 * plate body is held upright against it so the lighting stays fixed while the food turns.
 * `lifted` grows it a touch while the pointer is over it.
 */
export function TrayPlate({
  dish,
  custom,
  turn,
  lifted,
}: {
  dish: Dish;
  custom: TrayPlateCustom;
  turn: MotionValue<number>;
  lifted: boolean;
}) {
  const upright = useTransform(turn, (a) => -a);
  return (
    <motion.div
      style={{ rotate: upright }}
      custom={custom}
      variants={trayVariants}
      initial="enter"
      animate={{ opacity: 1, scale: lifted ? 1.03 : 1 }}
      transition={{ scale: { duration: 0.35, ease: EASE } }}
      exit="exit"
      className="plate relative aspect-square w-(--plate) rounded-full"
    >
      <PlateFace dish={dish} spin={turn} />
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
  onHover,
}: {
  dish: Dish;
  morphing: boolean;
  onOpen: () => void;
  onMorphDone: () => void;
  /** The tray plate underneath does the visible hover effect. */
  onHover: (hovering: boolean) => void;
}) {
  return (
    <motion.button
      type="button"
      layoutId={`dish-${dish.id}`}
      transition={{ layout: { duration: MORPH, ease: EASE } }}
      style={{ borderRadius: "50%" }}
      onClick={onOpen}
      onLayoutAnimationComplete={onMorphDone}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      className={`pointer-events-auto relative block aspect-square w-(--plate) cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-cream ${
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
