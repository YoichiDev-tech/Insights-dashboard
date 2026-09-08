module.exports = {
  darkMode: 'class',   // IMPORTANT
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pw_bg: '#050816',
        pw_panel: '#0b1020',
        pw_accent: '#38bdf8',
        pw_accent2: '#a855f7',
        pw_muted: '#64748b',
        pw_danger: '#ef4444',
        pw_success: '#22c55e'
      }
    }
  },
  plugins: []
};
