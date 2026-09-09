/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable holding an "R G B" triplet, so Tailwind's
// alpha modifiers (bg-accent/10, border-line/40) still work and both themes
// swap in one place. Values live in styles/globals.css.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        plane: v('plane'),
        surface: {
          DEFAULT: v('surface'),
          raised: v('surface-raised'),
          sunken: v('surface-sunken'),
        },
        ink: {
          primary: v('ink-primary'),
          secondary: v('ink-secondary'),
          muted: v('ink-muted'),
        },
        line: {
          DEFAULT: v('line'),
          strong: v('line-strong'),
        },
        accent: {
          DEFAULT: v('accent'),
          hover: v('accent-hover'),
          on: v('accent-on'),
        },
        status: {
          good: v('status-good'),
          warning: v('status-warning'),
          serious: v('status-serious'),
          critical: v('status-critical'),
        },
        series: {
          1: v('series-1'),
          2: v('series-2'),
          3: v('series-3'),
          4: v('series-4'),
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      maxWidth: { content: '76rem', prose: '44rem' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'panel-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'panel-in': 'panel-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};
