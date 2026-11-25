"use client";

import { useEffect, useRef, useState } from "react";
import { useWitchWorld } from "@/components/witch/WitchWorld";
import {
  AnimatedSprite,
  PixelSprite,
  BAT_A,
  BAT_B,
  BROOM_LEAN,
  CAT_A,
  CAT_B,
  CAULDRON,
  DESK,
  HUT,
  MOON,
  MUSHROOMS,
  OWL,
  SPARKLE,
  SPARKLE_GLOW,
  SPARKLE_SMALL,
  TREE,
  WITCH_STAND_A,
  WITCH_STAND_B,
} from "@/components/witch/sprites";

const POTIONS = [
  "✨ Brewed clean abstractions",
  "☕ Focus potion: 100% ready",
  "🔮 0 runtime errors detected",
  "📜 Spell: Zero Technical Debt",
  "✨ Mana restored // ready",
];

const CAT_SOUNDS = [
  "🐾 purr...",
  "(=^･ω･^=) meow~",
  "🐱 *happy purr*",
  "✨ cat familiar level up!",
];

/*
 * The witch's world: two small pixel plots standing on the footer's top
 * border — her home on the right, the grove with her outdoor desk on the
 * left (hidden on narrow screens). The scenes are decorative (aria-hidden)
 * and let clicks pass through; only the sprites themselves are clickable
 * (pointer-events-auto, kept out of the tab order). Keyboard users summon
 * a flight with 'W' instead.
 * The witch is ONE continuous character: she paces at home, walks to her
 * broom at takeoff, and the fixed overlay (WitchWorld) lifts off from the
 * broom's exact on-screen position — measured via the anchor marker below.
 */
const SPRITE_BUTTON = "pointer-events-auto cursor-pointer focus:outline-none";
const BUBBLE_MS = 2400;

export default function FooterScene() {
  const { phase, anchorRef, summonFlight } = useWitchWorld();
  const [bubble, setBubble] = useState<{ text: string; side: "home" | "grove" } | null>(
    null,
  );
  const bubbleTimer = useRef<number | null>(null);

  const showBubble = (text: string, side: "home" | "grove") => {
    setBubble({ text, side });
    // Restart the timer so a quick second click is not cut short by the first.
    if (bubbleTimer.current !== null) window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), BUBBLE_MS);
  };

  useEffect(
    () => () => {
      if (bubbleTimer.current !== null) window.clearTimeout(bubbleTimer.current);
    },
    [],
  );

  return (
    <>
      {/* The grove */}
      <div
        className="witch-scene pointer-events-none absolute bottom-full left-[4%] hidden text-ink sm:block"
        aria-hidden="true"
      >
        <div className="relative h-[96px] w-[200px] overflow-hidden">
          {/* Bare tree with a lantern */}
          <div className="absolute bottom-0 left-[4px]">
            <PixelSprite map={TREE} size={44} glowClassName="witch-window" />
          </div>

          {/* A bat circling the branches */}
          <div className="witch-bat absolute left-0 top-0">
            <AnimatedSprite a={BAT_A} b={BAT_B} size={18} />
          </div>

          {/* Desk with her laptop left on, and a warm mug */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => showBubble("💻 git push origin main // deployed", "grove")}
            title="Witch's outdoor coding desk"
            className={`group absolute bottom-0 left-[72px] text-left ${SPRITE_BUTTON}`}
          >
            <PixelSprite map={DESK} size={48} glowClassName="witch-screen" />
            <span className="witch-smoke absolute -top-1 left-[39px] h-0.5 w-0.5 bg-ink-muted" />
            <span className="witch-smoke witch-smoke-2 absolute -top-2 left-[42px] h-0.5 w-0.5 bg-ink-muted" />
          </button>

          <div className="absolute bottom-0 left-[150px]">
            <PixelSprite map={MUSHROOMS} size={20} glowClassName="witch-window" />
          </div>

          {/* Fireflies */}
          <span className="witch-firefly absolute left-[136px] top-[44px] h-0.5 w-0.5 bg-accent" />
          <span className="witch-firefly witch-firefly-2 absolute left-[170px] top-[58px] h-0.5 w-0.5 bg-accent" />
          <span className="witch-firefly witch-firefly-3 absolute left-[186px] top-[36px] h-0.5 w-0.5 bg-accent" />

          {/* Grove speech bubble */}
          {bubble && bubble.side === "grove" && (
            <div className="animate-fade-in-up pointer-events-none absolute bottom-12 left-10 z-20 rounded-sm border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-ink shadow-sm">
              {bubble.text}
            </div>
          )}
        </div>
      </div>

      {/* Home */}
      <div
        className="witch-scene pointer-events-none absolute bottom-full right-[4%] origin-bottom-right scale-75 text-ink sm:scale-100"
        aria-hidden="true"
      >
        <div className="relative h-[96px] w-[240px] overflow-hidden">
          {/* Night sky */}
          <div className="absolute left-[156px] top-[4px]">
            <PixelSprite map={MOON} size={16} />
          </div>
          <div className="witch-twinkle absolute left-[128px] top-[18px]">
            <PixelSprite map={SPARKLE_GLOW} size={10} />
          </div>
          <div className="witch-twinkle witch-twinkle-2 absolute left-[196px] top-[26px]">
            <PixelSprite map={SPARKLE} size={10} />
          </div>
          <div className="witch-twinkle witch-twinkle-3 absolute left-[6px] top-[12px]">
            <PixelSprite map={SPARKLE_SMALL} size={6} />
          </div>
          <div className="witch-twinkle witch-twinkle-2 absolute left-[224px] top-[8px]">
            <PixelSprite map={SPARKLE_SMALL} size={6} />
          </div>

          {/* Hut */}
          <div className="absolute bottom-0 left-0">
            <PixelSprite map={HUT} size={80} glowClassName="witch-window" />
          </div>

          {/* Owl on the chimney */}
          <div className="witch-owl absolute bottom-[56px] left-[54px]">
            <PixelSprite map={OWL} size={14} glowClassName="witch-owl-eyes" />
          </div>

          {/* Cauldron with fire and smoke (clickable) */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              const potion = POTIONS[Math.floor(Math.random() * POTIONS.length)];
              showBubble(potion, "home");
            }}
            title="Click cauldron to brew a spell"
            className={`group absolute bottom-0 left-[98px] text-left ${SPRITE_BUTTON}`}
          >
            <PixelSprite map={CAULDRON} size={24} glowClassName="witch-fire" />
            <span className="witch-smoke absolute -top-2 left-[10px] h-1 w-1 bg-ink-muted" />
            <span className="witch-smoke witch-smoke-2 absolute -top-1 left-[14px] h-1 w-1 bg-ink-muted" />
            <span className="witch-smoke witch-smoke-3 absolute -top-3 left-[7px] h-1 w-1 bg-ink-muted" />
          </button>

          {/* Broom anchor: the overlay witch lifts off from and lands on the
              on-screen position of this invisible marker. */}
          <div ref={anchorRef} className="absolute bottom-0 left-[84px] h-px w-px" />

          {/* Broom leaning on the hut wall (clickable to fly) */}
          {(phase === "home" || phase === "takeoff") && (
            <button
              type="button"
            tabIndex={-1}
              onClick={summonFlight}
              title="Click to mount broom and fly (or press 'W')"
              className={`absolute bottom-0 left-[78px] hover:opacity-80 ${SPRITE_BUTTON}`}
            >
              <PixelSprite map={BROOM_LEAN} size={10} />
            </button>
          )}
          {phase === "landing" && (
            <div className="witch-broom-return absolute bottom-0 left-[78px]">
              <PixelSprite map={BROOM_LEAN} size={10} />
            </div>
          )}

          {/* The witch on foot (clickable to fly) */}
          {phase === "home" && (
            <button
              type="button"
            tabIndex={-1}
              onClick={summonFlight}
              title="Click And-Witch to take flight (or press 'W')"
              className={`witch-pace absolute bottom-0 left-0 ${SPRITE_BUTTON}`}
            >
              <AnimatedSprite a={WITCH_STAND_A} b={WITCH_STAND_B} size={32} />
            </button>
          )}
          {phase === "takeoff" && (
            <div className="witch-walkout absolute bottom-0 left-0">
              <AnimatedSprite a={WITCH_STAND_A} b={WITCH_STAND_B} size={32} flip />
            </div>
          )}
          {phase === "landing" && (
            <div className="witch-dismount absolute bottom-0 left-0">
              <AnimatedSprite a={WITCH_STAND_A} b={WITCH_STAND_B} size={32} />
            </div>
          )}

          {/* The cat (clickable) */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              const sound = CAT_SOUNDS[Math.floor(Math.random() * CAT_SOUNDS.length)];
              showBubble(sound, "home");
            }}
            title="Click to pet the cat"
            className={`witch-cat absolute bottom-0 left-0 ${SPRITE_BUTTON}`}
          >
            <AnimatedSprite a={CAT_A} b={CAT_B} size={24} />
          </button>

          {/* Home speech bubble */}
          {bubble && bubble.side === "home" && (
            <div className="animate-fade-in-up pointer-events-none absolute bottom-14 right-10 z-20 rounded-sm border border-line bg-paper px-2.5 py-1 font-mono text-[10px] text-ink shadow-sm whitespace-nowrap">
              {bubble.text}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
