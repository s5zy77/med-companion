/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#2f6b4f',
          light: '#e8f3ee',
          dark: '#1a2e23',
        },
        accent2: {
          DEFAULT: '#b85c2a',
          light: '#fdf0e8',
        },
        cream: '#faf9f7',
        surface: '#ffffff',
        surface2: '#f3f2ef',
        warn: {
          DEFAULT: '#c9732a',
          light: '#fef3e8',
        },
        info: {
          DEFAULT: '#2a6b9b',
          light: '#e8f2fc',
        },
      },
      fontSize: {
        'elderly-sm': ['14px', '20px'],
        'elderly-base': ['16px', '24px'],
        'elderly-lg': ['18px', '26px'],
        'elderly-xl': ['20px', '28px'],
        'elderly-2xl': ['24px', '32px'],
        'elderly-3xl': ['30px', '38px'],
      },
      spacing: {
        'touch': '48px',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
};
