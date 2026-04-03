import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

// App theme tokens (from globals.css, converted to hex)
const COLOR_BG = "#f4f6f9";           // hsl(220 20% 97%)
const COLOR_FOREGROUND = "#0e1422";   // hsl(220 25% 10%)
const COLOR_PRIMARY = "#12a588";      // hsl(168 80% 36%)
const COLOR_MUTED_FG = "#6b7280";     // hsl(220 10% 46%)
const COLOR_ACCENT_BG = "#e8faf5";    // hsl(168 60% 94%)
const COLOR_BORDER = "#dde1e9";       // hsl(220 13% 91%)

export async function GET(req: NextRequest) {
  const { origin } = new URL(req.url);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLOR_BG,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top primary bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: COLOR_PRIMARY,
          }}
        />

        {/* Bottom border line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: COLOR_BORDER,
          }}
        />

        {/* Logo */}
        <img
          src={`${origin}/og-image.png`}
          width={140}
          height={140}
          style={{ borderRadius: 20, marginBottom: 28, border: `3px solid ${COLOR_BORDER}` }}
        />

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: COLOR_FOREGROUND,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 880,
            marginBottom: 16,
          }}
        >
          Own an iPhone Today
        </div>

        {/* Subheadline pill */}
        <div
          style={{
            display: "flex",
            backgroundColor: COLOR_ACCENT_BG,
            borderRadius: 999,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 28,
            paddingRight: 28,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 26,
              color: COLOR_PRIMARY,
              fontWeight: 600,
            }}
          >
            Weekly &amp; Monthly Payment Plans
          </span>
        </div>

        {/* Supporting text */}
        <div
          style={{
            fontSize: 22,
            color: COLOR_MUTED_FG,
            textAlign: "center",
            maxWidth: 760,
          }}
        >
          No full payment needed. Apply in minutes. Fast WhatsApp support.
        </div>

        {/* Brand tag */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 48,
            fontSize: 17,
            color: COLOR_MUTED_FG,
            fontWeight: 500,
          }}
        >
          Melvin Gadgets EasyBuy
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
