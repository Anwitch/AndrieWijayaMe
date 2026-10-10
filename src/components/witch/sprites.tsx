/*
 * Pixel sprite maps for the witch world. Each sprite is a string grid:
 *   "X" = ink pixel (currentColor)
 *   "W" = paper pixel (opaque — face, laptop lid)
 *   "O" = glow pixel (accent — fire, window light, glasses, lanterns)
 *   "." = empty
 * Rendered as 1x1 SVG rects so everything follows the design tokens and
 * needs no image assets. Sprites are drawn for 2px per grid pixel.
 */

export type SpriteMap = string[];

/* The witch on her broom, laptop on her lap (flights, 404). Faces right. */
export const WITCH_FLY_A: SpriteMap = [
  "..........XXX.................",
  ".........XXXXXX...............",
  ".........XX.XXXXX.............",
  "............XXXXXX............",
  "...........XXXXXXXX...........",
  "...........XXXXOXXXX..........",
  "......XXXXXXXXXXXXXXXXXX......",
  "........XXXXXXXXXXXXXXX.......",
  "..........XXXXXXXXXX..........",
  "..........XXXXWXXWXX..........",
  "..........XXXWOOXOOX..........",
  "..........XXXWWWWWWX..........",
  "...........XXXWWWWX...........",
  "....X......XXXXXXX............",
  "...XXX....XXXXXXXXX..XXXXX....",
  "..XXXXXX.XXXXXXXXXXX.XWWWX....",
  ".XXXXXXXXXXXXXXXXXXXXXWOWX....",
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXXX.....XXXX..............",
  ".XXXXX......XXX.X.............",
  "..XXX........X................",
];

export const WITCH_FLY_B: SpriteMap = [
  "..........XXX.................",
  ".........XXXXXX...............",
  ".........XX.XXXXX.............",
  "............XXXXXX............",
  "...........XXXXXXXX...........",
  "...........XXXXOXXXX..........",
  "......XXXXXXXXXXXXXXXXXX......",
  "........XXXXXXXXXXXXXXX.......",
  "..........XXXXXXXXXX..........",
  "..........XXXXWXXWXX..........",
  "..........XXXWOOXOOX..........",
  "..........XXXWWWWWWX..........",
  "...........XXXWWWWX...........",
  "...XX......XXXXXXX............",
  "....XXX...XXXXXXXXX..XXXXX....",
  "..XXXXXX.XXXXXXXXXXX.XWWWX....",
  ".XXXXXXXXXXXXXXXXXXXXXWOWX....",
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  ".XXXXXXX....XXXX..............",
  "XXXXXX......XXX.X.............",
  ".XXX.........X................",
];

/* The witch on foot, laptop under her arm. Two walk frames. */
export const WITCH_STAND_A: SpriteMap = [
  "...XXX..........",
  "..XXXXXX........",
  "..XX.XXXXX......",
  ".....XXXXXX.....",
  "....XXXXXXXX....",
  "....XXXOXXXX....",
  "XXXXXXXXXXXXXXXX",
  ".XXXXXXXXXXXXXX.",
  "...XXXXXXXXXX...",
  "...XXWXXWWXWX...",
  "...XWOOXXOOWX...",
  "...XWOOXXOOWX...",
  "....XWWWWWWX....",
  "....XXWWWWXX....",
  "...XXXXXXXXXX...",
  "..XXXXXOXXXXXX..",
  "..XXXXXXXXXXXXXX",
  ".XXXXXXXXXXXWWWX",
  ".XXXXXXXXXXXWOWX",
  ".XXXXXXXXXXXXXXX",
  "..XXXXXXXXXXXX..",
  "....XX....XX....",
  "....XX....XX....",
];

export const WITCH_STAND_B: SpriteMap = [
  "...XXX..........",
  "..XXXXXX........",
  "..XX.XXXXX......",
  ".....XXXXXX.....",
  "....XXXXXXXX....",
  "....XXXOXXXX....",
  "XXXXXXXXXXXXXXXX",
  ".XXXXXXXXXXXXXX.",
  "...XXXXXXXXXX...",
  "...XXWXXWWXWX...",
  "...XWOOXXOOWX...",
  "...XWOOXXOOWX...",
  "....XWWWWWWX....",
  "....XXWWWWXX....",
  "...XXXXXXXXXX...",
  "..XXXXXOXXXXXX..",
  "..XXXXXXXXXXXXXX",
  ".XXXXXXXXXXXWWWX",
  ".XXXXXXXXXXXWOWX",
  ".XXXXXXXXXXXXXXX",
  "..XXXXXXXXXXXX..",
  "...XX......XX...",
  "...XX......XX...",
];

/* The hut: crooked roof, chimney, glowing round window (O), arched door. */
export const HUT: SpriteMap = [
  ".............XX.........................",
  "..............XXX.......................",
  "...............XXXXX........XXXXXX......",
  "..............XX....XXX......X..X.......",
  ".............XX.......XXX....X..X.......",
  "............XX..........XXX..X..X.......",
  "...........XX..XX..XX..XX.XXXX..X.......",
  "..........XX................XX..X.......",
  "........XX....................XX........",
  ".......XX......................XX.......",
  "......XX..XX..XX..XX..XX..XX....XX......",
  ".....XX..........................XX.....",
  "....XX............................XX....",
  "..XX................................XX..",
  ".XX..................................XX.",
  "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "...X................................X...",
  "...X................................X...",
  "...X.....XXXX..........XXXXXX.......X...",
  "...X....XOOOOX........X......X......X...",
  "...X....XOOOOX........X......X......X...",
  "...X....XOOOOX........X......X......X...",
  "...X....XOOOOX........X......X......X...",
  "...X.....XXXX.........X......X......X...",
  "...X..................X....X.X......X...",
  "...X..................X......X......X...",
  "...X..................X......X......X...",
  "...X..................X......X......X...",
  "...X..................X......X......X...",
  "...XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX...",
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

/* Crescent moon and sparkles for the sky above the hut. */
export const MOON: SpriteMap = [
  "..XXX...",
  ".XXX....",
  "XXX.....",
  "XXX.....",
  "XXX.....",
  "XXXX...X",
  ".XXXXXX.",
  "..XXXX..",
];

export const SPARKLE: SpriteMap = [
  "..X..",
  "..X..",
  "XX.XX",
  "..X..",
  "..X..",
];

export const SPARKLE_GLOW: SpriteMap = [
  "..O..",
  "..O..",
  "OO.OO",
  "..O..",
  "..O..",
];

export const SPARKLE_SMALL: SpriteMap = [
  ".X.",
  "X.X",
  ".X.",
];

/* The grove: a bare crooked tree with a lantern (O) hung from a branch. */
export const TREE: SpriteMap = [
  "......X......X........",
  ".......X....X...X.....",
  "..X....X...XX..X......",
  "...X...XX..X..X.......",
  "....XX..XX.X.XX.......",
  "......X..XXXXX....X...",
  ".......XX.XXX....X....",
  ".........XXXX..XX.....",
  "X.........XXXXXX......",
  ".XX.......XXX.........",
  "...XXX....XXX.........",
  "......XXXXXXX.........",
  ".....X....XXX.........",
  ".....X....XXX.........",
  "....XXX...XXX.........",
  "....XOX...XXXX........",
  "....XOX...XXXX........",
  "....XXX...XXXX........",
  "..........XXXX........",
  "..........XXXX........",
  "..........XXXX........",
  ".........XXXXX........",
  ".........XXXXX........",
  ".........XXXXX........",
  ".........XXXXXX.......",
  "........XXXXXXX.......",
  "........XXXXXXX.......",
  ".......XXXXXXXXX......",
  ".....XXXX.XXX.XXXX....",
];

/* Her outdoor desk: open laptop (O screen), mug, and a stool. */
export const DESK: SpriteMap = [
  "......XXXXXXXX..........",
  "......XOOOOOOX..........",
  "......XOOOOOOX..........",
  "......XOOOOOOX....XXX.X.",
  "......XXXXXXXX....XXXXX.",
  "....XXXXXXXXXXXX..XXX...",
  "XXXXXXXXXXXXXXXXXXXXXXXX",
  ".XX..................XX.",
  ".XX..................XX.",
  ".XX......XXXXXX......XX.",
  ".XX.......X..X.......XX.",
  ".XX.......X..X.......XX.",
  ".XX.......X..X.......XX.",
];

/* Bat, two wing frames. */
export const BAT_A: SpriteMap = [
  "X..X.X..X",
  "XX.XXX.XX",
  ".XXXXXXX.",
  "...XXX...",
];

export const BAT_B: SpriteMap = [
  "...X.X...",
  ".XXXXXXX.",
  "XXXXXXXXX",
  "X.X...X.X",
];

/* Mushrooms with glowing spots (O). */
export const MUSHROOMS: SpriteMap = [
  ".....XXXX.",
  "....XOXXOX",
  ".X..XXXXXX",
  "XOX...XX..",
  ".X....XX..",
  ".X....XX..",
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
  const paper = mapToRects(map, "W");
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
      {paper.length > 0 && (
        <g fill="var(--color-paper)">
          {paper.map(({ x, y }) => (
            <rect key={`p-${x}-${y}`} x={x} y={y} width={1} height={1} />
          ))}
        </g>
      )}
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

/** The flying witch (flight overlay and 404 page). */
export function PixelWitchSprite({
  size = 60,
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
