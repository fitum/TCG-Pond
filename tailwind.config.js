/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pond: {
          bg: '#080c18',
          surface: '#0f1623',
          card: '#151d2e',
          border: '#1e2a3a',
          muted: '#4a5568',
          text: '#e2e8f0',
          subtle: '#94a3b8',
        },
        pokemon: { primary: '#CC0000', accent: '#FFCB05' },
        onepiece: { primary: '#E31E24', accent: '#1a56db' },
        dragonball: { primary: '#FF7F00', accent: '#FFD700' },
        yugioh: { primary: '#6B21A8', accent: '#DBA309' },
        mtg: { primary: '#1D4ED8', accent: '#D97706' },
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.5)',
        glow: '0 0 20px rgba(204,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};


