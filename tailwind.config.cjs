/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'miami-sunset': 'linear-gradient(135deg, #FF41A6 0%, #FF8E42 100%)',
        'ocean-drive': 'linear-gradient(180deg, #0A0C14 0%, #1A0933 100%)',
        'neon-glow': 'linear-gradient(135deg, #00A5E5 0%, #00E574 100%)',
      },
    },
  },
  plugins: [],
};
