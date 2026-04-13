import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void:      "#0A0A0A",
        surface:   "#111111",
        surface2:  "#1A1A1A",
        border:    "#2A2A2A",
        border2:   "#3A3A3A",
        text1:     "#F0EBE0",
        text2:     "#A09880",
        text3:     "#606050",
        gold:      "#C8B97A",
        "gold-dim":"#6B5E3A",
        lichen:    "#4A6741",
        amber:     "#8B6914",
      },
      fontFamily: {
        display:    ["var(--font-cormorant)", "Georgia", "serif"],
        mono:       ["var(--font-space-mono)", "Courier New", "monospace"],
        sans:       ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(4rem, 10vw, 9rem)",    { lineHeight: "0.9",  letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(3rem, 7vw, 6rem)",     { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 4vw, 3.5rem)",   { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1",  letterSpacing: "-0.01em" }],
        "body-xl":    ["1.5rem",   { lineHeight: "1.6" }],
        "body-lg":    ["1.25rem",  { lineHeight: "1.7" }],
        "body-md":    ["1rem",     { lineHeight: "1.6" }],
        "caption":    ["0.75rem",  { lineHeight: "1.4", letterSpacing: "0.08em" }],
        "mono-sm":    ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.04em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "28": "7rem",
        "36": "9rem",
        "44": "11rem",
        "52": "13rem",
        "60": "15rem",
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      gridTemplateColumns: {
        "12": "repeat(12, minmax(0, 1fr))",
        "specimen": "repeat(auto-fill, minmax(280px, 1fr))",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "power3-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      backgroundImage: {
        "gradient-void": "linear-gradient(to bottom, transparent 0%, #0A0A0A 100%)",
        "gradient-void-top": "linear-gradient(to top, transparent 0%, #0A0A0A 80%)",
        "gradient-radial-gold": "radial-gradient(ellipse at center, rgba(200,185,122,0.08) 0%, transparent 70%)",
      },
      borderRadius: {
        DEFAULT: "2px",
        "sm": "2px",
        "md": "4px",
        "lg": "4px",
      },
      animation: {
        "fade-in": "fadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up": "slideUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
