module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0b0e27',
        'bg-card': '#151a36',
        'neon-green': '#02fe88',
        'neon-cyan': '#00d9ff',
        'text-white': '#ffffff',
        'text-light': '#b8c5d6',
      },
      backgroundImage: {
        'gradient-cyan': 'linear-gradient(135deg, #00d9ff 0%, #0b0e27 100%)',
        'gradient-green': 'linear-gradient(135deg, #02fe88 0%, #0b0e27 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 217, 255, 0.3)',
        'neon-green': '0 0 20px rgba(2, 254, 136, 0.3)',
        'neon-glow': '0 0 30px rgba(0, 217, 255, 0.5), 0 0 40px rgba(2, 254, 136, 0.3)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
