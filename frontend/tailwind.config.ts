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
        tactical: {
          950: "#050811",
          900: "#080d1a",
          850: "#0c1426",
          800: "#111b33",
          700: "#1b294d",
          600: "#283b6b",
          border: "#1e293b",
          borderGlow: "#00f0ff33",
          cyan: "#00f0ff",
          blue: "#3b82f6",
          amber: "#ffb700",
          crimson: "#ff2a5f",
          emerald: "#00ff88",
          radar: "#00ffcc"
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -2px rgba(0, 240, 255, 0.4)',
        'glow-crimson': '0 0 15px -2px rgba(255, 42, 95, 0.4)',
        'glow-amber': '0 0 15px -2px rgba(255, 183, 0, 0.4)',
        'tactical-card': '0 4px 20px -2px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
};
export default config;
