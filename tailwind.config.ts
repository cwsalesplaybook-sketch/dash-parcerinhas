import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cw-purple':       '#A543FA',
        'cw-purple-dark':  '#59327A',
        'cw-red':          '#FF5959',
        'cw-yellow':       '#FFB600',
        'cw-bg':           '#F4EDF7',
        'cw-surface':      '#FFFFFF',
        'cw-elevated':     '#FAF7FC',
        'cw-border':       '#E9DDF2',
        'cw-text':         '#1A0A2E',
        'cw-muted':        '#7B5EA7',
        'cw-sidebar':      '#20092F',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
