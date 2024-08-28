/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        reveal: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        reveal: 'reveal 3s ease-out forwards',
      },
      colors: {
        customStart: '#1b263b', // Starting color of the gradient
        buttoncolor: '#4361ee'
      
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, #ff0000, #00ff00, #0000ff)', // Custom gradient
      },
    },
  },
  plugins: [],
}

