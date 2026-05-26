/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0A',
        magenta: { DEFAULT: '#FF0080', dark: '#8B0040', light: '#FF66B3' },
        lime: { DEFAULT: '#39FF14', dark: '#1F8B00', light: '#85FF62' },
        cyan: { DEFAULT: '#00FFFF', dark: '#007B8B', light: '#80FFFF' },
        gold: { DEFAULT: '#FFD700', dark: '#8B7700', light: '#FFE966' },
        arcade: { bg: '#0A0A0A', surface: '#111111', card: '#1A1A1A', border: '#2A2A2A' },
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Impact"', '"Arial Narrow"', 'sans-serif'],
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'glow-magenta': '0 0 15px rgba(255,0,128,0.7), 0 0 30px rgba(255,0,128,0.3)',
        'glow-cyan': '0 0 15px rgba(0,255,255,0.7), 0 0 30px rgba(0,255,255,0.3)',
        'glow-lime': '0 0 15px rgba(57,255,20,0.7), 0 0 30px rgba(57,255,20,0.3)',
        'glow-gold': '0 0 15px rgba(255,215,0,0.7), 0 0 30px rgba(255,215,0,0.3)',
        'btn-magenta': '0 6px 0 #8B0040, 0 0 20px rgba(255,0,128,0.3)',
        'btn-cyan': '0 6px 0 #007B8B, 0 0 20px rgba(0,255,255,0.3)',
        'btn-lime': '0 6px 0 #1F8B00, 0 0 20px rgba(57,255,20,0.3)',
        'btn-gold': '0 6px 0 #8B7700, 0 0 20px rgba(255,215,0,0.3)',
      },
      animation: {
        ticker: 'ticker 32s linear infinite',
        'glitch-1': 'glitch1 4s steps(1) infinite',
        'glitch-2': 'glitch2 4s steps(1) infinite 0.12s',
        flicker: 'flicker 0.12s infinite',
        'pulse-border': 'pulseborder 2s ease-in-out infinite',
      },
      keyframes: {
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        glitch1: {
          '0%,90%': { opacity: '0' },
          '91%': { opacity: '0.85', clipPath: 'polygon(0 15%,100% 15%,100% 45%,0 45%)', transform: 'translate(-3px)' },
          '93%': { opacity: '0' },
        },
        glitch2: {
          '0%,92%': { opacity: '0' },
          '93%': { opacity: '0.7', clipPath: 'polygon(0 55%,100% 55%,100% 80%,0 80%)', transform: 'translate(3px)' },
          '95%': { opacity: '0' },
        },
        flicker: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.85' } },
        pulseborder: {
          '0%,100%': { boxShadow: '0 0 8px rgba(255,0,128,0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(255,0,128,0.9), 0 0 50px rgba(255,0,128,0.4)' },
        },
      },
    },
  },
  plugins: [],
};
