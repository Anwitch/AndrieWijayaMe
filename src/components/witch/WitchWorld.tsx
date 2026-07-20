"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { PixelWitchSprite } from "@/components/witch/sprites";

/** Dispatch this window event to summon a takeoff (used by the navbar logo). */
export const WITCH_FLY_EVENT = "andwitch:fly";

/**
 * The witch's day, as a cycle with ONE continuous witch:
 *
 *   home --(3-5 min / logo click)--> takeoff (walks to her broom in the
 *   diorama) --> flying (a single fixed-position witch lifts off FROM the
 *   broom's on-screen position, arcs up, crosses the viewport, comes back
 *   and lands on the same spot — driven by the Web Animations API)
 *   --> landing (dismounts, broom leans back on the wall) --> home
 */
export type WitchPhase = "home" | "takeoff" | "flying" | "landing";

type WitchWorldContext = {
  phase: WitchPhase;
  /** FooterScene attaches this to an invisible marker at the broom spot. */
  anchorRef: RefObject<HTMLDivElement | null>;
};

const WitchContext = createContext<WitchWorldContext>({
  phase: "home",
  anchorRef: { current: null },
});

export function useWitchWorld() {
  return useContext(WitchContext);
}

export function useWitchPhase() {
  return useContext(WitchContext).phase;
}

/** Walk-to-the-broom duration; must match the witchWalkOut keyframes. */
export const TAKEOFF_MS = 1600;
/** Dismount walk duration; must match the witchDismount keyframes. */
export const LANDING_MS = 1900;
const FIRST_FLIGHT_DELAY_MS = 2500;
const AMBIENT_MIN_MS = 3 * 60 * 1000;
const AMBIENT_MAX_MS = 5 * 60 * 1000;
const AWAY_PAUSE_MS = 1500;

/* Offsets that seat the mounted sprite (44px wide, flipped) on the anchor. */
const SPRITE_OFFSET_X = -26;
const SPRITE_OFFSET_Y = -26;

export function WitchProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<WitchPhase>("home");
  const [flightId, setFlightId] = useState<number | null>(null);
  const [facingLeft, setFacingLeft] = useState(true);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const busyRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const begin = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPhase("takeoff");
    timerRef.current = window.setTimeout(() => {
      setPhase("flying");
      setFlightId(Date.now());
    }, TAKEOFF_MS);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    timerRef.current = window.setTimeout(begin, FIRST_FLIGHT_DELAY_MS);
    window.addEventListener(WITCH_FLY_EVENT, begin);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      window.removeEventListener(WITCH_FLY_EVENT, begin);
    };
  }, [begin]);

  /* The continuous flight: lift off from the broom anchor, cross the
     viewport, glide back, and touch down on the same anchor. */
  useEffect(() => {
    if (flightId === null) return;
    const el = overlayRef.current;
    if (el === null) return;
    let cancelled = false;

    const anchorPoint = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect) {
        return {
          x: rect.left + SPRITE_OFFSET_X,
          y: rect.top + SPRITE_OFFSET_Y,
        };
      }
      return {
        x: window.innerWidth * 0.88 + SPRITE_OFFSET_X,
        y: window.innerHeight + SPRITE_OFFSET_Y,
      };
    };

    const finishCycle = () => {
      setFlightId(null);
      setPhase("landing");
      timerRef.current = window.setTimeout(() => {
        setPhase("home");
        busyRef.current = false;
        const delay =
          AMBIENT_MIN_MS + Math.random() * (AMBIENT_MAX_MS - AMBIENT_MIN_MS);
        timerRef.current = window.setTimeout(begin, delay);
      }, LANDING_MS);
    };

    const run = async () => {
      const width = window.innerWidth;
      const altitude =
        window.innerHeight * (0.15 + Math.random() * 0.25);

      try {
        const start = anchorPoint();
        el.style.transform = `translate(${start.x}px, ${start.y}px)`;
        el.style.visibility = "visible";

        /* Pick a random exit side; face the way she flies. */
        const exitLeft = Math.random() < 0.5;
        setFacingLeft(exitLeft);
        const exitX = exitLeft ? -100 : width + 100;
        const midX = exitLeft
          ? start.x - width * 0.25
          : start.x + (width - start.x) * 0.45;

        /* Mount pause, then a rising arc out of the viewport. */
        await el.animate(
          [
            { transform: `translate(${start.x}px, ${start.y}px)` },
            {
              transform: `translate(${start.x}px, ${start.y - 8}px)`,
              offset: 0.08,
            },
            {
              transform: `translate(${midX}px, ${
                altitude + (start.y - altitude) * 0.3
              }px)`,
              offset: 0.4,
            },
            { transform: `translate(${exitX}px, ${altitude}px)` },
          ],
          {
            duration: exitLeft ? 9000 + Math.random() * 3000 : 5000 + Math.random() * 1500,
            easing: "ease-in-out",
            fill: "forwards",
          },
        ).finished;
        if (cancelled) return;

        /* A breather off-screen, then glide home from a random side —
           facing the direction of travel. */
        await new Promise((resolve) => setTimeout(resolve, AWAY_PAUSE_MS));
        if (cancelled) return;

        const enterLeft = Math.random() < 0.5;
        setFacingLeft(!enterLeft);
        const end = anchorPoint();
        const enterX = enterLeft ? -100 : width + 100;
        const midX2 = enterLeft
          ? end.x - width * 0.2
          : end.x + (width - end.x) * 0.5;

        await el.animate(
          [
            { transform: `translate(${enterX}px, ${altitude}px)` },
            {
              transform: `translate(${midX2}px, ${
                altitude + (end.y - altitude) * 0.4
              }px)`,
              offset: 0.6,
            },
            {
              transform: `translate(${end.x}px, ${end.y - 8}px)`,
              offset: 0.94,
            },
            { transform: `translate(${end.x}px, ${end.y}px)` },
          ],
          {
            duration: enterLeft ? 10000 : 7000,
            easing: "ease-in-out",
            fill: "forwards",
          },
        ).finished;
        if (cancelled) return;

        finishCycle();
      } catch {
        /* Animation was cancelled (page navigation / unmount). */
      }
    };

    void run();
    return () => {
      cancelled = true;
      el.getAnimations().forEach((animation) => animation.cancel());
    };
  }, [flightId, begin]);

  return (
    <WitchContext.Provider value={{ phase, anchorRef }}>
      {children}
      {flightId !== null && (
        <div
          ref={overlayRef}
          className="witch-overlay text-ink"
          style={{ top: 0, left: 0, visibility: "hidden" }}
          aria-hidden="true"
        >
          <div className="witch-bob">
            <PixelWitchSprite flip={facingLeft} />
          </div>
        </div>
      )}
    </WitchContext.Provider>
  );
}
