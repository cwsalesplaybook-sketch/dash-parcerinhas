import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F0E17',
        surface: '#1A1828',
        border: '#2D2A45',
        purple: {
          DEFAULT: '#7C3AED',
          light: '#A855F7',
          dark: '#5B21B6',
        },
        text: {
          primary: '#F4F1FF',
          muted: '#8B859E',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
