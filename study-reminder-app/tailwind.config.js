/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material You / Material 3 system colors (light theme)
        'md-primary': 'var(--md-sys-color-primary)',
        'md-secondary': 'var(--md-sys-color-secondary)',
        'md-tertiary': 'var(--md-sys-color-tertiary)',
        'md-background': 'var(--md-sys-color-background)',
        'md-surface': 'var(--md-sys-color-surface)',
        'md-error': 'var(--md-sys-color-error)',
        'md-outline': 'var(--md-sys-color-outline)',
      },
    },
  },
  plugins: [],
};