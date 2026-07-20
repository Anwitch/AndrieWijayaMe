import { ImageResponse } from "next/og";

export const alt = "Andrie Wijaya — Merancang Solusi dari Masalah Nyata";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0f14",
          padding: "80px",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#7dd3fc",
          }}
        >
          anwitch.me
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 700, lineHeight: 1.05 }}>
            Andrie Wijaya
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 40,
              color: "#cbd5e1",
              lineHeight: 1.2,
              maxWidth: 920,
            }}
          >
            Merancang solusi digital dari masalah dunia nyata.
          </div>
          <div style={{ display: "flex", marginTop: 40, height: 8, width: 130, background: "#38bdf8" }} />
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#94a3b8" }}>
          Problem solving, bukan sekadar coding.
        </div>
      </div>
    ),
    { ...size },
  );
}
