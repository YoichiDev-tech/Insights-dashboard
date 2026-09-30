/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: { DEFAULT: '#0a0e1a', 2: '#10182b', soft: '#8b93a7', line: '#1e2534' },
        paper: { DEFAULT: '#f3f4f1', 2: '#ebe9e2', line: '#dcd9d0' },
        amber: { DEFAULT: '#ffb84d' },
        coral: { DEFAULT: '#ff7a59' },
        violet: { DEFAULT: '#6c63ff' },
        pw_bg: '#0a0e1a',
        pw_panel: '#10182b',
        pw_accent: '#ffb84d',
        pw_accent2: '#6c63ff',
        pw_muted: '#8b93a7',
        pw_danger: '#ff7a59',
        pw_success: '#37e6c4',
        slate: { 400: '#8b93a7', 700: '#2a3348', 800: '#1e2534', 900: '#10182b', 950: '#0a0e1a' },
      },
    },
  },
  plugins: [],
};