/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0B101D',
        'navy-panel': '#0E1527',
        'navy-card': '#131C31',
        'navy-border': '#1E2A45',
        'navy-hover': '#243456',
        'accent-blue': '#2563EB',
        'accent-green': '#16A34A',
        'accent-emerald': '#10B981',
        'accent-red': '#DC2626',
        'accent-cyan': '#00F0FF'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'sans-serif'],
        mono: ['JetBrains Mono', '"SF Mono"', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
