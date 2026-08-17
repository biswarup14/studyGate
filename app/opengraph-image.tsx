import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "GATE CS Prep — Previous Year Questions & Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #faf6ef 0%, #e8e1d3 50%, #faf6ef 100%)",
          padding: "60px",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "32px",
              fontWeight: "900",
              fontFamily: "sans-serif",
            }}
          >
            G
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#0f0f0f",
              fontFamily: "sans-serif",
            }}
          >
            GATE CS Prep
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "900",
            color: "#0f0f0f",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "24px",
            fontFamily: "sans-serif",
          }}
        >
          Previous Year Questions
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#5a5a5a",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "800px",
            fontFamily: "sans-serif",
          }}
        >
          3,200+ questions from 2000–2026 with solutions, quizzes, and progress tracking
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          {["13 Subjects", "27 Years", "MCQ · MSQ · NAT"].map((stat) => (
            <div
              key={stat}
              style={{
                fontSize: "18px",
                color: "#2563eb",
                fontWeight: "600",
                fontFamily: "sans-serif",
              }}
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
