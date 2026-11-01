import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Half-steps used across components (p-4.5, w-5.5 …) that aren't in
      // Tailwind's default scale — without these the classes silently no-op.
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      colors: {
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
        },
        cyan: {
          DEFAULT: 'rgb(var(--cyan) / <alpha-value>)',
          soft: 'rgb(var(--cyan) / 0.2)',
        },
        violet: {
          DEFAULT: 'rgb(var(--violet) / <alpha-value>)',
          soft: 'rgb(var(--violet) / 0.2)',
        },
        text: {
          DEFAULT: 'rgb(var(--text-main) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          dim: 'rgb(var(--text-dim) / <alpha-value>)',
        },
      },
      fontFamily: {
        // Each stack pairs a Latin face with an Arabic companion so mixed
        // AR/EN text always renders with intentional fonts.
        display: ['"Sora"', '"Readex Pro"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Sans Arabic"', 'ui-monospace', 'monospace'],
        arabic: ['"IBM Plex Sans Arabic"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'arabic-display': ['"Readex Pro"', '"Sora"', 'system-ui', 'sans-serif'],
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
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translate3d(-50%, 0, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
      },
      animation: {
        marquee: 'marquee 34s linear infinite',
        'marquee-reverse': 'marquee-reverse 34s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
