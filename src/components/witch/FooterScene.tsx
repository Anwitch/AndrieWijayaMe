"use client";

import { useWitchWorld } from "@/components/witch/WitchWorld";
import {
  AnimatedSprite,
  PixelSprite,
  BROOM_LEAN,
  CAT_A,
  CAT_B,
  CAULDRON,
  HUT,
  OWL,
  WITCH_STAND_A,
  WITCH_STAND_B,
} from "@/components/witch/sprites";

/*
 * The witch's home: a small pixel diorama standing on the footer's top
 * border. Every inhabitant is decorative (aria-hidden, no pointer events).
 * The witch is ONE continuous character: she paces at home, walks to her
 * broom at takeoff, and the fixed overlay (WitchWorld) lifts off from the
 * broom's exact on-screen position — measured via the anchor marker below.
 */
export default function FooterScene() {
  const { phase, anchorRef } = useWitchWorld();

  return (
    <div
      className="witch-scene pointer-events-none absolute bottom-full right-[4%] origin-bottom-right scale-75 text-ink sm:scale-100"
      aria-hidden="true"
    >
      <div className="relative h-[96px] w-[220px] overflow-hidden">
        {/* Hut */}
        <div className="absolute bottom-0 left-0">
          <PixelSprite map={HUT} size={76} glowClassName="witch-window" />
        </div>

        {/* Owl on the roof */}
        <div className="witch-owl absolute bottom-[46px] left-[30px]">
          <PixelSprite map={OWL} size={14} glowClassName="witch-owl-eyes" />
        </div>

        {/* Cauldron with fire and smoke */}
        <div className="absolute bottom-0 left-[96px]">
          <PixelSprite map={CAULDRON} size={26} glowClassName="witch-fire" />
          <span className="witch-smoke absolute -top-2 left-[10px] h-1 w-1 bg-ink-muted" />
          <span className="witch-smoke witch-smoke-2 absolute -top-1 left-[14px] h-1 w-1 bg-ink-muted" />
          <span className="witch-smoke witch-smoke-3 absolute -top-3 left-[7px] h-1 w-1 bg-ink-muted" />
        </div>

        {/* Broom anchor: the overlay witch lifts off from and lands on the
            on-screen position of this invisible marker. */}
        <div ref={anchorRef} className="absolute bottom-0 left-[80px] h-px w-px" />

        {/* Broom leaning on the hut wall — gone while she is out flying */}
        {(phase === "home" || phase === "takeoff") && (
          <div className="absolute bottom-0 left-[76px]">
            <PixelSprite map={BROOM_LEAN} size={10} />
          </div>
        )}
        {phase === "landing" && (
          <div className="witch-broom-return absolute bottom-0 left-[76px]">
            <PixelSprite map={BROOM_LEAN} size={10} />
          </div>
        )}

        {/* The witch on foot: pacing at home, walking to the broom at
            takeoff, dismounting and walking off after landing */}
        {phase === "home" && (
          <div className="witch-pace absolute bottom-0 left-0">
            <AnimatedSprite a={WITCH_STAND_A} b={WITCH_STAND_B} size={22} />
          </div>
        )}
        {phase === "takeoff" && (
          <div className="witch-walkout absolute bottom-0 left-0">
            <AnimatedSprite a={WITCH_STAND_A} b={WITCH_STAND_B} size={22} flip />
          </div>
        )}
        {phase === "landing" && (
          <div className="witch-dismount absolute bottom-0 left-0">
            <AnimatedSprite a={WITCH_STAND_A} b={WITCH_STAND_B} size={22} />
          </div>
        )}

        {/* The cat: paces the yard, pauses near the cauldron */}
        <div className="witch-cat absolute bottom-0 left-0">
          <AnimatedSprite a={CAT_A} b={CAT_B} size={24} />
        </div>
      </div>
    </div>
  );
}
