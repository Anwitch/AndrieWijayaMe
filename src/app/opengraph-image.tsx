import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Andrie Wijaya — Merancang Solusi dari Masalah Nyata";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Same tokens as globals.css (docs/DESIGN_SYSTEM.md): monochrome, editorial. */
const INK = "#000000";
const INK_SECONDARY = "#333333";
const INK_MUTED = "#666666";
const LINE = "#e5e5e5";
const ACCENT = "#1d6fa4";

const SECTIONS = ["About", "Projects", "Writing", "Lab"];

// Satori cannot read woff2, so the OG image ships its own IBM Plex TTFs.
const font = (file: string) =>
  readFile(join(process.cwd(), "src/app/og-fonts", file));

export default async function Image() {
  const [sans400, sans600, mono400, mono500] = await Promise.all([
    font("IBMPlexSans-400.ttf"),
    font("IBMPlexSans-600.ttf"),
    font("IBMPlexMono-400.ttf"),
    font("IBMPlexMono-500.ttf"),
  ]);

  const mono = {
    fontFamily: "IBM Plex Mono",
    textTransform: "uppercase" as const,
    letterSpacing: "3px",
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: "0 72px",
          color: INK,
          fontFamily: "IBM Plex Sans",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            ...mono,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 84,
            borderBottom: `1px solid ${LINE}`,
            fontSize: 17,
          }}
        >
          <div style={{ display: "flex", fontWeight: 500 }}>Andrie Wijaya</div>
          <div style={{ display: "flex", color: INK_MUTED }}>anwitch.me</div>
        </div>

        <div style={{ display: "flex", flex: 1, justifyContent: "space-between" }}>
          {/* Page header */}
          <div style={{ display: "flex", flexDirection: "column", width: 700, paddingTop: 64 }}>
            <div style={{ ...mono, display: "flex", fontSize: 18, color: ACCENT }}>
              Problem Solver
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontSize: 88,
                fontWeight: 600,
                lineHeight: 1.04,
              }}
            >
              Andrie Wijaya
            </div>
            <div style={{ display: "flex", marginTop: 30, width: 80, height: 6, background: INK }} />
            <div
              style={{
                display: "flex",
                marginTop: 30,
                maxWidth: 560,
                fontSize: 32,
                lineHeight: 1.4,
                color: INK_SECONDARY,
              }}
            >
              Merancang solusi digital dari masalah dunia nyata.
            </div>
          </div>

          {/* Mission index */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center",
              width: 300,
              marginTop: 40,
              borderTop: `1px solid ${LINE}`,
            }}
          >
            {SECTIONS.map((label, i) => (
              <div
                key={label}
                style={{
                  ...mono,
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "18px 4px",
                  borderBottom: `1px solid ${LINE}`,
                  fontSize: 18,
                  color: INK_MUTED,
                }}
              >
                <div style={{ display: "flex" }}>{`0${i + 1}`}</div>
                <div style={{ display: "flex", color: INK, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer line */}
        <div
          style={{
            ...mono,
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 44,
            fontSize: 18,
            color: INK_MUTED,
          }}
        >
          <div style={{ display: "flex" }}>Problem solving, bukan sekadar coding.</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "IBM Plex Sans", data: sans400, weight: 400, style: "normal" },
        { name: "IBM Plex Sans", data: sans600, weight: 600, style: "normal" },
        { name: "IBM Plex Mono", data: mono400, weight: 400, style: "normal" },
        { name: "IBM Plex Mono", data: mono500, weight: 500, style: "normal" },
      ],
    },
  );
}
