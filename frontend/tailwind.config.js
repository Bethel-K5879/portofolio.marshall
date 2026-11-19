/** @type {import('tailwindcss').Config} */
// Les couleurs et polices viennent des variables CSS définies dans src/index.css (un bloc par preset).
const c = (v) => `rgb(var(--${v}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: c('ink'),
        navy: c('navy'),
        accent: c('accent'),
        'accent-text': c('accent-text'),
        'accent-light': c('accent-light'),
        bg: c('bg'),
        txt: c('text'),
        light: c('light'),
        secondary: c('secondary'),
        muted: c('muted'),
        deep: c('deep'),
        'on-accent': c('on-accent'),
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
        title: 'var(--font-title)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}
