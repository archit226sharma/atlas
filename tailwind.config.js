/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        accent: '#22c55e',
        'accent-dim': '#15803d',
        background: 'var(--bg-color)',
        surface: 'var(--surface)',
        'surface-container': 'var(--surface-container)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container-high': 'var(--surface-container-high)',
        'outline-variant': 'var(--border-color)',
        'on-background': 'var(--text-main)',
        'on-surface-variant': 'var(--text-muted)',
        'code-bg': 'var(--code-bg)'
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace']
      }
    }
  },
  plugins: []
}
