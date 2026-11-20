"use client";

import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import type { Dish } from "@/lib/menu";
import { MORPH } from "./motion";
import { FrontPlate, TrayPlate, TURN_DURATION } from "./plate";

/*
 * A round wooden tray (think lazy susan) that turns to bring each dish to the front.
 *
 * Geometry, in plate diameters P (--plate):
 *   tray diameter 3.45P, radius R = 1.725P, the tray's bottom edge sits on the section's bottom
 *   plate centre sits 0.3P above that edge, so 1.425P from the tray centre
 *
 * Each dish gets a "slot" on the tray, STEP degrees apart. Turning the tray by one STEP
 * carries the old plate up and over the top edge on one side while the new one comes
 * round from the other; plates, wood grain and all turn together. The plate is only
 * visible within ~78° of the front (beyond that it is above the clipped top edge), so
 * at 150° the old plate has gone just as the new one appears.
 */
const STEP = 150; // degrees between neighbouring slots
const TURN_EASE = [0.45, 0, 0.2, 1] as const; // brisk departure, slow settle
const WOOD = "https://images.unsplash.com/photo-1688127145963-1063f22622a5?w=1600&h=1600&fit=crop&auto=format&q=80";

/** One slot on the tray, positioned at its angle and holding the dish's plate. */
function Slot({
  slot,
  angle,
  dish,
  custom,
  lifted,
}: {
  slot: number;
  angle: MotionValue<number>;
  dish: Dish;
  custom: { instant: boolean };
  lifted: boolean;
}) {
  const turn = useTransform(angle, (a) => a + slot * STEP);
  return (
    <div className="absolute top-1/2 left-1/2 size-0" style={{ transform: `rotate(${slot * STEP}deg)` }}>
      <div className="absolute top-[calc(var(--plate)*0.925)] left-[calc(var(--plate)*-0.5)]">
        <TrayPlate dish={dish} custom={custom} turn={turn} lifted={lifted} />
      </div>
    </div>
  );
}

type Props = {
  dish: Dish;
  slot: number;
  modalOpen: boolean;
  /** The dialog has closed and the front plate is still morphing back into place. */
  returning: boolean;
  onOpen: () => void;
  onReturned: () => void;
};

export function Tray({ dish, slot, modalOpen, returning, onOpen, onReturned }: Props) {
  const angle = useMotionValue(-slot * STEP);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const controls = animate(angle, -slot * STEP, reduce ? { duration: 0 } : { duration: TURN_DURATION, ease: TURN_EASE });
    return () => controls.stop();
  }, [slot, angle, reduce]);

  // Safety net in case the layout animation is skipped (e.g. reduced motion).
  useEffect(() => {
    if (!returning) return;
    const t = setTimeout(onReturned, (MORPH + 0.4) * 1000);
    return () => clearTimeout(t);
  }, [returning, onReturned]);

  const handOver = modalOpen || returning;
  const custom = { instant: handOver };

  return (
    <>
      {/* Clip only above the table: plates rising off the top disappear, but the front
          plate is free to hang over the tray's bottom edge. */}
      <div className="pointer-events-none absolute inset-0 z-[1]" style={{ clipPath: "inset(0 -100vw -100vh -100vw)" }}>
        <div className="absolute bottom-0 left-[calc(50%-var(--plate)*1.725)] aspect-square w-[calc(var(--plate)*3.45)]">
          <div className="tray-edge absolute inset-0 translate-y-[calc(var(--plate)*0.025)] rounded-full" />
          <motion.div className="absolute inset-0 overflow-hidden rounded-full" style={{ rotate: angle }}>
            <Image src={WOOD} alt="" fill sizes="(max-width: 768px) 220vw, 1100px" className="tray-wood object-cover" priority />
          </motion.div>
          {/* Light from the front stays put while the wood turns under it */}
          <div className="tray-light pointer-events-none absolute inset-0 rounded-full" />

          <motion.div className="pointer-events-none absolute inset-0" style={{ rotate: angle }}>
            <AnimatePresence initial={false} custom={custom}>
              {!handOver && <Slot key={slot} slot={slot} angle={angle} dish={dish} custom={custom} lifted={hovered} />}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--plate)*-0.2)] z-10 flex justify-center">
        {!modalOpen && <FrontPlate
            dish={dish}
            morphing={returning}
            onOpen={() => {
              setHovered(false);
              onOpen();
            }}
            onMorphDone={onReturned}
            onHover={setHovered}
          />}
      </div>
    </>
  );
}
