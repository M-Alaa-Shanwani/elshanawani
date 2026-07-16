import type { Config } from 'tailwindcss';

// Design tokens for the "Blueprint" system — a dark, technical, dual-accent
// theme built around the idea of software as constructed architecture.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070C', // page background
          900: '#0A0E17', // section background
          800: '#0D1220', // card surface
          700: '#141B2E', // raised surface / borders
          600: '#232C46', // hairline borders on surfaces
        },
        cyan: {
          DEFAULT: '#5EEBFF',
          soft: '#5EEBFF33',
        },
        violet: {
          DEFAULT: '#9D7CFF',
          soft: '#9D7CFF33',
        },
        text: {
          DEFAULT: '#E6ECFF',
          muted: '#8A93B3',
          dim: '#545E7E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        arabic: ['"Cairo"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(180deg, rgba(94,235,255,0.06) 0%, rgba(5,7,12,0) 60%)',
        'blueprint-grid':
          'linear-gradient(rgba(94,235,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,235,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        blueprint: '48px 48px',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(94,235,255,0.35)',
        'glow-violet': '0 0 40px -10px rgba(157,124,255,0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
