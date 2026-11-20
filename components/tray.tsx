"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import type { Dish } from "@/lib/menu";
import { EASE, MORPH } from "./motion";
import { FrontPlate, TrayPlate } from "./plate";

/*
 * A round wooden tray (think lazy susan) that turns to bring each dish to the front.
 *
 * Geometry, in plate diameters P (--plate):
 *   tray diameter 3.45P, radius R = 1.725P, the tray's bottom edge sits on the section's bottom
 *   plate centre sits 0.3P above that edge, so 1.425P from the tray centre
 *
 * Each dish gets a "slot" on the tray, STEP degrees apart. Turning the tray by one STEP
 * carries the old plate off one side and the new one in from the other; plates, wood
 * grain and all turn together.
 */
const STEP = 48; // degrees between neighbouring slots; ≥ 44° keeps plates from overlapping

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

  useEffect(() => {
    const controls = animate(angle, -slot * STEP, reduce ? { duration: 0 } : { duration: 1.1, ease: EASE });
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
      <div className="absolute inset-0" style={{ clipPath: "inset(0 -100vw -100vh -100vw)" }}>
        <div className="absolute bottom-0 left-[calc(50%-var(--plate)*1.725)] aspect-square w-[calc(var(--plate)*3.45)]">
          <motion.div className="wood absolute inset-0 overflow-hidden rounded-full" style={{ rotate: angle }} />
          {/* Light from the front stays put while the wood turns under it */}
          <div className="tray-light pointer-events-none absolute inset-0 rounded-full" />

          <motion.div className="pointer-events-none absolute inset-0" style={{ rotate: angle }}>
            <AnimatePresence initial={false} custom={custom}>
              {!handOver && (
                <div
                  key={slot}
                  className="absolute top-1/2 left-1/2 size-0"
                  style={{ transform: `rotate(${slot * STEP}deg)` }}
                >
                  <div className="absolute top-[calc(var(--plate)*0.925)] left-[calc(var(--plate)*-0.5)]">
                    <TrayPlate dish={dish} custom={custom} />
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[calc(var(--plate)*-0.2)] z-10 flex justify-center">
        {!modalOpen && <FrontPlate dish={dish} morphing={returning} onOpen={onOpen} onMorphDone={onReturned} />}
      </div>
    </>
  );
}
