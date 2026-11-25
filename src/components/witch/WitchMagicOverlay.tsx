"use client";

import { useEffect, useRef, type RefObject } from "react";

const ASCII_SPARKLES = ["*", "+", "✦", "✧", "·", "░", "~", "^", "⌑", "x", "°"];
const GLYPHS = "*+~#%&!?/\\01<>:;=✧✦";
const COLORS = [
  "rgba(29, 111, 164, 0.95)", // accent primary
  "rgba(91, 163, 201, 0.9)",  // accent light
  "rgba(122, 144, 164, 0.8)", // muted slate
  "rgba(11, 24, 41, 0.75)",   // deep ink
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  alpha: number;
  decay: number;
  size: number;
}

/** One text node inside a [data-witch-text] element. Only nodeValue is
 *  touched, so React keeps owning the element and its children. */
interface TrackedNode {
  node: Text;
  original: string;
  /** What we last wrote; if it differs, React re-rendered the text. */
  written: string;
}

interface TrackedText {
  el: HTMLElement;
  nodes: TrackedNode[];
  isScrambled: boolean;
  intervalId: number | null;
  lastScramble: number;
}

interface TrackedReactive {
  el: HTMLElement;
  isEnchanted: boolean;
}

interface WitchMagicOverlayProps {
  overlayRef: RefObject<HTMLDivElement | null>;
  facingLeft: boolean;
  isActive: boolean;
}

const SCRAMBLE_EVERY_MS = 70;

const textNodesOf = (el: HTMLElement): Text[] => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
};

const isBlank = (ch: string) => ch === " " || ch === "\n" || ch === "\t";
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export default function WitchMagicOverlay({
  overlayRef,
  facingLeft,
  isActive,
}: WitchMagicOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Read through a ref so turning around mid-flight does not restart the effect
  // (which would snap all text back and drop the particle trail).
  const facingLeftRef = useRef(facingLeft);
  useEffect(() => {
    facingLeftRef.current = facingLeft;
  }, [facingLeft]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number | null = null;
    let lastSpawn = 0;
    const particles: Particle[] = [];

    // Resize canvas to full window with devicePixelRatio for crisp font rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Collect reactive text and component elements on page
    const textElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-witch-text]"),
    );
    const trackedTexts: TrackedText[] = textElements.map((el) => ({
      el,
      nodes: textNodesOf(el).map((node) => {
        const value = node.nodeValue ?? "";
        return { node, original: value, written: value };
      }),
      isScrambled: false,
      intervalId: null,
      lastScramble: 0,
    }));

    /** Write a mix of original and glyph characters; keepRatio 1 = original. */
    const paint = (item: TrackedText, keepRatio: number) => {
      for (const n of item.nodes) {
        if (n.node.nodeValue !== n.written) n.original = n.node.nodeValue ?? "";
        n.written =
          keepRatio >= 1
            ? n.original
            : Array.from(n.original)
                .map((ch) =>
                  isBlank(ch) || Math.random() < keepRatio ? ch : randomGlyph(),
                )
                .join("");
        n.node.nodeValue = n.written;
      }
    };

    const reactiveElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-witch-reactive]"),
    );
    const trackedReactives: TrackedReactive[] = reactiveElements.map((el) => ({
      el,
      isEnchanted: false,
    }));

    const PROXIMITY_RADIUS = 135;

    const scramble = (item: TrackedText, time: number) => {
      if (item.intervalId !== null) {
        window.clearInterval(item.intervalId);
        item.intervalId = null;
      }
      if (time - item.lastScramble < SCRAMBLE_EVERY_MS) return;
      item.lastScramble = time;
      paint(item, 0.25);
    };

    const restore = (item: TrackedText) => {
      if (item.intervalId !== null) {
        window.clearInterval(item.intervalId);
      }
      let step = 0;
      const maxSteps = 4;
      item.intervalId = window.setInterval(() => {
        step++;
        if (step >= maxSteps) {
          paint(item, 1);
          if (item.intervalId !== null) {
            window.clearInterval(item.intervalId);
            item.intervalId = null;
          }
          return;
        }
        paint(item, step / maxSteps);
      }, 45);
    };

    const render = (time: number) => {
      const el = overlayRef.current;
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      let witchCenter: { x: number; y: number } | null = null;

      if (isActive && el && el.style.visibility !== "hidden") {
        const rect = el.getBoundingClientRect();
        const onScreen =
          rect.right >= -120 &&
          rect.left <= window.innerWidth + 120 &&
          rect.bottom >= -120 &&
          rect.top <= window.innerHeight + 120;

        if (onScreen) {
          witchCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };

          // Broom tail location based on flight orientation
          const facingLeft = facingLeftRef.current;
          const tailX = facingLeft ? rect.right - 10 : rect.left + 10;
          const tailY = rect.top + 26;

          // Emit ASCII sparkles
          if (time - lastSpawn > 50) {
            lastSpawn = time;
            const count = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
              particles.push({
                x: tailX + (Math.random() * 10 - 5),
                y: tailY + (Math.random() * 8 - 4),
                vx:
                  (facingLeft ? 1 : -1) * (0.8 + Math.random() * 1.6) +
                  (Math.random() * 0.4 - 0.2),
                vy: 0.5 + Math.random() * 1.3,
                char:
                  ASCII_SPARKLES[
                    Math.floor(Math.random() * ASCII_SPARKLES.length)
                  ],
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: 1,
                decay: 0.02 + Math.random() * 0.025,
                size: 11 + Math.floor(Math.random() * 5),
              });
            }
          }
        }
      }

      // Proximity checks against interactive page elements
      if (witchCenter) {
        const center = witchCenter;
        const distanceTo = (el: HTMLElement) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < -50 || r.top > window.innerHeight + 50) return null;
          const closestX = Math.max(r.left, Math.min(center.x, r.right));
          const closestY = Math.max(r.top, Math.min(center.y, r.bottom));
          return Math.hypot(center.x - closestX, center.y - closestY);
        };
        // Measure everything before writing, so text changes do not force a
        // layout per element.
        const textDistances = trackedTexts.map((item) => distanceTo(item.el));
        const reactiveDistances = trackedReactives.map((item) => distanceTo(item.el));

        trackedTexts.forEach((item, i) => {
          const dist = textDistances[i];
          if (dist === null) return;
          if (dist < PROXIMITY_RADIUS) {
            item.isScrambled = true;
            scramble(item, time);
          } else if (item.isScrambled) {
            item.isScrambled = false;
            restore(item);
          }
        });

        trackedReactives.forEach((item, i) => {
          const dist = reactiveDistances[i];
          if (dist === null) return;
          if (dist < PROXIMITY_RADIUS + 30) {
            if (!item.isEnchanted) {
              item.isEnchanted = true;
              item.el.classList.add("witch-enchanted");
            }
          } else if (item.isEnchanted) {
            item.isEnchanted = false;
            item.el.classList.remove("witch-enchanted");
          }
        });
      } else {
        // Witch off-screen or stopped; restore any remaining scrambled items
        for (const item of trackedTexts) {
          if (item.isScrambled) {
            item.isScrambled = false;
            restore(item);
          }
        }
        for (const item of trackedReactives) {
          if (item.isEnchanted) {
            item.isEnchanted = false;
            item.el.classList.remove("witch-enchanted");
          }
        }
      }

      // Draw and update particle stardust
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px 'IBM Plex Mono', monospace`;
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();
      }

      // Continue animation loop if active or particles remain
      if (isActive || particles.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);

      for (const item of trackedTexts) {
        if (item.intervalId !== null) window.clearInterval(item.intervalId);
        paint(item, 1);
      }
      for (const item of trackedReactives) {
        item.el.classList.remove("witch-enchanted");
      }
    };
  }, [overlayRef, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  );
}
