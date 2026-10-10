"use client";

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

/*
 * The witch's world: two small pixel plots standing on the footer's top
 * border — her home on the right, the grove with her outdoor desk on the
 * left (hidden on narrow screens). Every inhabitant is decorative
 * (aria-hidden, no pointer events).
 * The witch is ONE continuous character: she paces at home, walks to her
 * broom at takeoff, and the fixed overlay (WitchWorld) lifts off from the
 * broom's exact on-screen position — measured via the anchor marker below.
 */
export default function FooterScene() {
  const { phase, anchorRef } = useWitchWorld();

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
          <div className="absolute bottom-0 left-[72px]">
            <PixelSprite map={DESK} size={48} glowClassName="witch-screen" />
            <span className="witch-smoke absolute -top-1 left-[39px] h-0.5 w-0.5 bg-ink-muted" />
            <span className="witch-smoke witch-smoke-2 absolute -top-2 left-[42px] h-0.5 w-0.5 bg-ink-muted" />
          </div>

          <div className="absolute bottom-0 left-[150px]">
            <PixelSprite map={MUSHROOMS} size={20} glowClassName="witch-window" />
          </div>

          {/* Fireflies */}
          <span className="witch-firefly absolute left-[136px] top-[44px] h-0.5 w-0.5 bg-accent" />
          <span className="witch-firefly witch-firefly-2 absolute left-[170px] top-[58px] h-0.5 w-0.5 bg-accent" />
          <span className="witch-firefly witch-firefly-3 absolute left-[186px] top-[36px] h-0.5 w-0.5 bg-accent" />
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

          {/* Cauldron with fire and smoke */}
          <div className="absolute bottom-0 left-[98px]">
            <PixelSprite map={CAULDRON} size={24} glowClassName="witch-fire" />
            <span className="witch-smoke absolute -top-2 left-[10px] h-1 w-1 bg-ink-muted" />
            <span className="witch-smoke witch-smoke-2 absolute -top-1 left-[14px] h-1 w-1 bg-ink-muted" />
            <span className="witch-smoke witch-smoke-3 absolute -top-3 left-[7px] h-1 w-1 bg-ink-muted" />
          </div>

          {/* Broom anchor: the overlay witch lifts off from and lands on the
              on-screen position of this invisible marker. */}
          <div ref={anchorRef} className="absolute bottom-0 left-[84px] h-px w-px" />

          {/* Broom leaning on the hut wall — gone while she is out flying */}
          {(phase === "home" || phase === "takeoff") && (
            <div className="absolute bottom-0 left-[78px]">
              <PixelSprite map={BROOM_LEAN} size={10} />
            </div>
          )}
          {phase === "landing" && (
            <div className="witch-broom-return absolute bottom-0 left-[78px]">
              <PixelSprite map={BROOM_LEAN} size={10} />
            </div>
          )}

          {/* The witch on foot: pacing at home, walking to the broom at
              takeoff, dismounting and walking off after landing */}
          {phase === "home" && (
            <div className="witch-pace absolute bottom-0 left-0">
              <AnimatedSprite a={WITCH_STAND_A} b={WITCH_STAND_B} size={32} />
            </div>
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

          {/* The cat: paces the yard, pauses near the cauldron */}
          <div className="witch-cat absolute bottom-0 left-0">
            <AnimatedSprite a={CAT_A} b={CAT_B} size={24} />
          </div>
        </div>
      </div>
    </>
  );
}
