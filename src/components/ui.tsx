import Link from "next/link";
import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

/*
 * Shared UI kit — the single place where recurring visual patterns live.
 * Every page (public and mission control) composes from these primitives so
 * the design system (docs/DESIGN_SYSTEM.md) stays consistent by construction.
 */

/* ----------------------------------------------------------------- Eyebrow */

const eyebrowToneClass = {
  muted: "text-ink-muted",
  accent: "text-accent",
  faint: "text-ink-faint",
  ink: "text-ink",
} as const;

export type EyebrowTone = keyof typeof eyebrowToneClass;

/** Mono uppercase label — section markers, meta text, table headers. */
export function Eyebrow({
  as: Tag = "span",
  tone = "muted",
  className = "",
  children,
}: {
  as?: ElementType;
  tone?: EyebrowTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`font-mono text-xs uppercase tracking-widest ${eyebrowToneClass[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------- PageHeader */

/** Page title block: accent eyebrow, H1, signature bar, optional lede. */
export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="mb-16">
      {eyebrow && (
        <Eyebrow tone="accent" className="mb-2 block">
          {eyebrow}
        </Eyebrow>
      )}
      <h1 className="text-4xl font-semibold leading-tight text-ink md:text-5xl">
        {title}
      </h1>
      <div className="mt-6 h-1 w-16 bg-ink" />
      {lede && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-secondary">
          {lede}
        </p>
      )}
    </header>
  );
}

/* ---------------------------------------------------------- SectionHeading */

/** H2 row with bottom rule and optional mono aside (counts, tags). */
export function SectionHeading({
  title,
  aside,
}: {
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-10 flex items-end justify-between border-b border-line pb-4">
      <h2 className="text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
      {aside && <Eyebrow className="hidden md:block">{aside}</Eyebrow>}
    </div>
  );
}

/* ------------------------------------------------------------------ Button */

const buttonVariantClass = {
  primary: "bg-ink text-paper hover:bg-ink-secondary disabled:bg-ink-faint",
  outline:
    "border border-line text-ink-muted hover:border-ink hover:text-ink disabled:text-ink-faint disabled:hover:border-line",
} as const;

export type ButtonVariant = keyof typeof buttonVariantClass;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${buttonVariantClass[variant]} ${className}`}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------- MonoLink */

/** Mono uppercase link — navigation, back links, "view all" CTAs. */
export function MonoLink({
  href,
  external = false,
  className = "",
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = `inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-ink ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------- EmptyState */

export function EmptyState({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-y border-dashed border-line py-20 text-center ${className}`}
    >
      <Eyebrow>{children}</Eyebrow>
    </div>
  );
}

/* ---------------------------------------------------------------- Skeleton */

/** Loading placeholder block; wrap a group in `animate-pulse`. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-surface ${className}`} />;
}

/* ------------------------------------------------------------------- Panel */

/**
 * Mission-control panel. `sm` = sidebar card with eyebrow title;
 * `lg` = manager section with a display title and optional aside slot.
 */
export function Panel({
  id,
  icon,
  title,
  subtitle,
  aside,
  size = "sm",
  className = "",
  children,
}: {
  id?: string;
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  aside?: ReactNode;
  size?: "sm" | "lg";
  className?: string;
  children: ReactNode;
}) {
  const isLarge = size === "lg";
  return (
    <section
      id={id}
      className={`rounded-sm border border-line bg-paper shadow-sm ${
        isLarge ? "scroll-mt-8 p-5 sm:p-8" : "p-6"
      } ${className}`}
    >
      <div
        className={`border-b border-line ${
          isLarge
            ? "mb-8 flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:justify-between"
            : "mb-6 flex items-center justify-between pb-2"
        }`}
      >
        <div>
          <div className={`flex items-center ${isLarge ? "gap-3" : "gap-2"}`}>
            {icon}
            {isLarge ? (
              <h2 className="text-2xl font-semibold uppercase tracking-tight text-ink">
                {title}
              </h2>
            ) : (
              <Eyebrow as="h2" tone="ink" className="font-semibold">
                {title}
              </Eyebrow>
            )}
          </div>
          {subtitle && (
            <Eyebrow as="p" className="mt-2">
              {subtitle}
            </Eyebrow>
          )}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------ FeedbackNote */

const feedbackToneClass = {
  error: "border-danger-line bg-danger-bg text-danger",
  success: "border-success-line bg-success-bg text-success",
} as const;

export function FeedbackNote({
  tone,
  className = "",
  children,
}: {
  tone: keyof typeof feedbackToneClass;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-sm border p-3 text-sm ${feedbackToneClass[tone]} ${className}`}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------ Form recipes */

/** Mono uppercase form label. */
export const labelClass =
  "font-mono text-xs uppercase tracking-widest text-ink-muted";

/** Boxed input/textarea/select (mission control). */
export const inputClass =
  "w-full rounded-sm border border-line-strong bg-paper px-3 py-2 text-sm outline-none transition-colors focus:border-ink disabled:bg-surface";

/** Underline-style input (inline add/edit forms). */
export const inputUnderlineClass =
  "w-full border-b border-line-strong bg-transparent py-1 text-sm outline-none transition-colors focus:border-ink";
