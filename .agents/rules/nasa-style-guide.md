---
trigger: always_on
---

# CLAUDE.md — Design & Code Rules
## Project: The Digital Journal of Andrie Wijaya

> These rules must be followed by all AI agents working on this project. Goal: visual consistency, tone, and code quality across the entire codebase.

---

## 1. DESIGN PHILOSOPHY

**North Star:** `https://www.nasa.gov/people/reid-wiseman/`

What to capture from this reference:
- **Clean, institutional authority** — feels official but not stiff
- **Crystal-clear information hierarchy** — the eye knows immediately what to read first
- **Large photo + structured text** — a confident profile, not a "creative" portfolio
- **Whitespace as a design element** — empty space is a feature, not emptiness
- **Label-value pairs** — data presented structurally, not as long paragraphs

**Tone:** Professional but not cold. Technical but readable by anyone. Minimal but with character.

**AVOID:**
- ❌ Excessive animations, gradients everywhere
- ❌ Cliché hero text ("I build things for the web")
- ❌ Dark mode with neon purple/pink
- ❌ Overly expressive display fonts
- ❌ Decorative elements that carry no information

---

## 2. VISUAL IDENTITY

### Color Palette
```css
:root {
  --bg-primary:     #FFFFFF;
  --bg-secondary:   #F5F7FA;
  --bg-surface:     #EEF2F7;
  --text-primary:   #0B1829;
  --text-secondary: #3D5166;
  --text-muted:     #7A90A4;
  --accent-primary: #1D6FA4;
  --accent-light:   #5BA3C9;
  --accent-subtle:  #D6EAF5;
  --border-default: #D1DCE8;
  --border-strong:  #A3B8CC;
}
```

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

--font-sans: 'IBM Plex Sans', system-ui, sans-serif;
--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
```

**IBM Plex Sans** = primary font. Institutional, clean, used by NASA & IBM. Not Inter/Roboto.
**IBM Plex Mono** = labels, metadata, code, and NASA-style "data" elements.

### Type Scale
```
H1 (hero):    text-4xl font-semibold leading-tight text-[--text-primary]
H2 (section): text-2xl font-semibold text-[--text-primary]
H3 (card):    text-lg font-semibold text-[--text-primary]
Lead:         text-lg text-[--text-secondary] leading-relaxed max-w-prose
Body:         text-base text-[--text-secondary] leading-relaxed
NASA label:   font-mono text-xs uppercase tracking-widest text-[--text-muted]
```

Rules: Never use `font-bold` for headings — use `font-semibold`. Always apply `max-w-prose` to long paragraphs.

---

## 3. COMPONENT PATTERNS

### NASA Label-Value Pair
```tsx
<div className="flex flex-col gap-1">
  <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
    Location
  </span>
  <span className="text-base text-[var(--text-primary)]">
    Pontianak, West Kalimantan, ID
  </span>
</div>
```

### Metadata Strip
```tsx
<div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-[var(--border-default)] py-4">
  {[{ label: "Status", value: "Available for Work" }, { label: "Based in", value: "Pontianak, ID" }]
    .map(({ label, value }) => (
      <div key={label} className="flex flex-col gap-0.5">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
        <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
      </div>
  ))}
</div>
```

### Section Header
```tsx
<div className="mb-10">
  <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-light)] mb-2 block">
    About
  </span>
  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Section Title</h2>
  <div className="mt-3 h-px w-16 bg-[var(--accent-primary)]" />
</div>
```

### Profile Hero Layout
```tsx
<section className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-10 items-start py-16">
  <div>
    <Image src="/andrie-profile.jpg" alt="Andrie Wijaya, Software Developer" width={360} height={480}
      priority className="w-full aspect-[3/4] object-cover rounded-sm" />
    <div className="mt-2 h-1 w-12 bg-[var(--accent-primary)]" />
  </div>
  <div className="flex flex-col gap-6 pt-2">
    <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
      Software Developer
    </span>
    <h1 className="text-4xl font-semibold text-[var(--text-primary)] leading-tight">Andrie Wijaya</h1>
    {/* Metadata Strip */}
    <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-prose">
      Short bio here. Max 3–4 sentences.
    </p>
  </div>
</section>
```

### Card (Project/Writing)
```tsx
<article className="border border-[var(--border-default)] rounded-sm p-5
  hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)]
  transition-colors duration-200 group">
  <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-light)]">
    Next.js · TypeScript
  </span>
  <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]
    group-hover:text-[var(--accent-primary)] transition-colors">
    Project Title
  </h3>
  <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
    Short description.
  </p>
  <div className="mt-4 text-xs text-[var(--text-muted)] font-mono">2024 · View Project →</div>
</article>
```

### Navbar
```tsx
<nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[var(--border-default)]">
  <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
    <a href="/" className="font-mono text-sm font-medium hover:text-[var(--accent-primary)] transition-colors">
      ANDRIE WIJAYA
    </a>
    <div className="flex gap-6">
      {["About", "Projects", "Writing"].map(l => (
        <a key={l} href={`/${l.toLowerCase()}`}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          {l}
        </a>
      ))}
    </div>
  </div>
</nav>
```

---

## 4. LAYOUT RULES

- **Max width:** `max-w-5xl` (1024px)
- **Horizontal padding:** `px-6` mobile → `px-8` desktop
- **Section spacing:** `py-16` standard, `py-24` for hero
- **Grid:** 1-col mobile → 2-col desktop. Avoid 3-col except for data grids
- **Alignment:** Left-aligned throughout. Center only for isolated CTAs
- **Dividers:** Use `border-t border-[var(--border-default)]` — never bare `<hr>`

---

## 5. ANIMATION & MOTION

**Principle:** Subtle and purposeful. No animation for animation's sake.

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
.animate-fade-in-up:nth-child(2) { animation-delay: 80ms; }
.animate-fade-in-up:nth-child(3) { animation-delay: 160ms; }
```

**NOT allowed:** aggressive parallax · per-character text animation · `duration-500` · `scale-105`+ on hover · Framer Motion/GSAP

---

## 6. TAILWIND CONFIG

```ts
// tailwind.config.ts — required
theme: {
  extend: {
    fontFamily: {
      sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
    },
    colors: {
      accent: { DEFAULT: '#1D6FA4', light: '#5BA3C9', subtle: '#D6EAF5' },
      surface: '#EEF2F7',
    },
  },
}
```

---

## 7. CONTENT TONE

- **Name:** Andrie Wijaya | **Location:** Pontianak, West Kalimantan, Indonesia
- **Title:** Software Developer — never "wizard", "ninja", or "guru"

**✅ Correct:** Factual, direct, no hyperbole
> "Software developer based in Pontianak. I build web applications with Next.js and TypeScript."

**❌ Wrong:** Buzzwords and clichés
> "Passionate developer who loves crafting amazing digital experiences."

---

## 8. QUICK REFERENCE

| DO ✅ | DON'T ❌ |
|---|---|
| IBM Plex Sans + Mono | Inter, Roboto, Arial |
| `font-mono uppercase tracking-widest` for labels | Plain label styling |
| Large photo, confident asymmetric layout | Small photo, generic symmetric layout |
| Generous whitespace | Filling every space with content |
| Thin border `--border-default` | Heavy `shadow-xl` everywhere |
| Blue accent `#1D6FA4` | Purple/neon gradients |
| Left-aligned text | Centering all text |
| `rounded-sm` for cards | `rounded-2xl` or `rounded-full` on cards |
| Hover: subtle border + bg change | Hover: scale or dramatic shadow |
| `next/image` with `priority` | Bare `<img>` tags |

---

*This file is the single source of truth. If there is any conflict between these rules and an AI agent's default opinion, follow these rules.*