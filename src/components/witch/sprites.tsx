/*
 * Pixel sprite maps for the witch world. Each sprite is a string grid:
 *   "X" = silhouette pixel (currentColor / ink)
 *   "O" = glow pixel (accent — fire, window light, owl eyes)
 *   "." = empty
 * Rendered as 1x1 SVG rects so everything follows the design tokens and
 * needs no image assets.
 */

export type SpriteMap = string[];

/* Witch riding the broom (used for flights, takeoff/landing, 404). */
export const WITCH_FLY_A: SpriteMap = [
  ".............X..........",
  "............XX..........",
  "............XXX.........",
  "...........XXXX.........",
  ".........XXXXXXXXX......",
  "...........XXXX.........",
  "...........XXXX.........",
  "..........XXXXX.........",
  ".......X..XXXXXX........",
  "......XX.XXXXXXXX.......",
  ".....XXXXXXXXXX.XX......",
  "..XXXXXXXXXXXXXXXXXXXX..",
  ".XXXX.......XXX.........",
  ".XXX........XX.X........",
  "..X..........X..........",
  "........................",
];

export const WITCH_FLY_B: SpriteMap = [
  ".............X..........",
  "............XX..........",
  "............XXX.........",
  "...........XXXX.........",
  ".........XXXXXXXXX......",
  "...........XXXX.........",
  "...........XXXX.........",
  "..........XXXXX.........",
  "......XX..XXXXXX........",
  ".......X.XXXXXXXX.......",
  ".....XXXXXXXXXX.XX......",
  "..XXXXXXXXXXXXXXXXXXXX..",
  ".XXXXX......XXX.........",
  "..XX........XX.X........",
  ".X...........X..........",
  "........................",
];

/* Witch on foot (no broom), two walk frames. */
export const WITCH_STAND_A: SpriteMap = [
  ".....X....",
  "....XX....",
  "....XXX...",
  "...XXXX...",
  ".XXXXXXXX.",
  "....XXX...",
  "...XXXX...",
  "...XXXX...",
  "..XXXXX...",
  "..XXXXXX..",
  ".XXXXXXX..",
  ".XXXXXXXX.",
  "...X..X...",
  "...X..X...",
];

export const WITCH_STAND_B: SpriteMap = [
  ".....X....",
  "....XX....",
  "....XXX...",
  "...XXXX...",
  ".XXXXXXXX.",
  "....XXX...",
  "...XXXX...",
  "...XXXX...",
  "..XXXXX...",
  "..XXXXXX..",
  ".XXXXXXX..",
  ".XXXXXXXX.",
  "..X....X..",
  "..X....X..",
];

/* The hut: chimney, glowing window (O), door. */
export const HUT: SpriteMap = [
  "..........XXXX..........",
  ".....XX..XXXXXX.........",
  ".....XX.XX....XX........",
  ".....XXXX......XX.......",
  "....XX..........XX......",
  "...XX............XX.....",
  "..XX..............XX....",
  ".XXXXXXXXXXXXXXXXXXXX...",
  ".X..................X...",
  ".X..XXXX......XXXX..X...",
  ".X..XOOX......X..X..X...",
  ".X..XOOX......X..X..X...",
  ".X..XXXX......X..X..X...",
  ".X............X..X..X...",
  ".XXXXXXXXXXXXXXXXXXX....",
];

/* Owl with glowing eyes (O). */
export const OWL: SpriteMap = [
  ".XX.XX.",
  ".XXXXX.",
  ".XOXOX.",
  ".XXXXX.",
  "..XXX..",
  "..XXX..",
  "..X.X..",
];

/* Cauldron with fire (O) beneath. */
export const CAULDRON: SpriteMap = [
  "..X......X..",
  "...XXXXXX...",
  "..XXXXXXXX..",
  ".XXXXXXXXXX.",
  ".XXXXXXXXXX.",
  "..XXXXXXXX..",
  "...X....X...",
  "....OOO.....",
  "...OOOOO....",
];

/* Cat, two walk frames (faces right). */
export const CAT_A: SpriteMap = [
  "X........XX.",
  "X.......XXXX",
  ".X......XXX.",
  ".XXXXXXXXXX.",
  ".XXXXXXXXX..",
  ".X.X....X.X.",
];

export const CAT_B: SpriteMap = [
  ".........XX.",
  "X.......XXXX",
  "X.......XXX.",
  ".XXXXXXXXXX.",
  ".XXXXXXXXX..",
  "..X.X..X.X..",
];

/* Broom leaning against the hut wall. */
export const BROOM_LEAN: SpriteMap = [
  "....X",
  "...X.",
  "...X.",
  "..X..",
  "..X..",
  ".X...",
  ".X...",
  "XX...",
  "XX...",
  "XXX..",
  "XX...",
  "X....",
];

/* ------------------------------------------------------------- renderers */

function mapToRects(map: SpriteMap, char: string) {
  const rects: { x: number; y: number }[] = [];
  map.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === char) rects.push({ x, y });
    }
  });
  return rects;
}

/** Renders one sprite frame. `size` is the rendered width in px. */
export function PixelSprite({
  map,
  size,
  flip = false,
  className = "",
  glowClassName = "",
}: {
  map: SpriteMap;
  size: number;
  flip?: boolean;
  className?: string;
  glowClassName?: string;
}) {
  const cols = map[0].length;
  const rows = map.length;
  const ink = mapToRects(map, "X");
  const glow = mapToRects(map, "O");
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={size}
      height={(size * rows) / cols}
      aria-hidden="true"
      className={className}
      style={{
        shapeRendering: "crispEdges",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <g>
        {ink.map(({ x, y }) => (
          <rect key={`i-${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
        ))}
      </g>
      {glow.length > 0 && (
        <g className={glowClassName} fill="var(--color-accent)">
          {glow.map(({ x, y }) => (
            <rect key={`g-${x}-${y}`} x={x} y={y} width={1} height={1} />
          ))}
        </g>
      )}
    </svg>
  );
}

/** Two frames stacked and toggled by the .witch-frame CSS animation. */
export function AnimatedSprite({
  a,
  b,
  size,
  flip = false,
  className = "",
  glowClassName = "",
}: {
  a: SpriteMap;
  b: SpriteMap;
  size: number;
  flip?: boolean;
  className?: string;
  glowClassName?: string;
}) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <PixelSprite map={a} size={size} className="witch-frame block" glowClassName={glowClassName} />
      <PixelSprite
        map={b}
        size={size}
        className="witch-frame witch-frame-alt absolute inset-0"
        glowClassName={glowClassName}
      />
    </span>
  );
}

/** The classic flying witch (kept for the flight overlay and 404 page). */
export function PixelWitchSprite({
  size = 48,
  flip = false,
  animate = true,
  className = "",
}: {
  size?: number;
  flip?: boolean;
  animate?: boolean;
  className?: string;
}) {
  if (!animate) {
    return <PixelSprite map={WITCH_FLY_A} size={size} flip={flip} className={className} />;
  }
  return <AnimatedSprite a={WITCH_FLY_A} b={WITCH_FLY_B} size={size} flip={flip} className={className} />;
}
