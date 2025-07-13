/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'md': {
          'sys': {
            'color': {
              'primary': 'var(--md-sys-color-primary)',
              'primary-container': 'var(--md-sys-color-primary-container)',
              'secondary': 'var(--md-sys-color-secondary)',
              'secondary-container': 'var(--md-sys-color-secondary-container)',
              'tertiary': 'var(--md-sys-color-tertiary)',
              'tertiary-container': 'var(--md-sys-color-tertiary-container)',
              'surface': 'var(--md-sys-color-surface)',
              'surface-variant': 'var(--md-sys-color-surface-variant)',
              'background': 'var(--md-sys-color-background)',
              'error': 'var(--md-sys-color-error)',
              'error-container': 'var(--md-sys-color-error-container)',
              'on-primary': 'var(--md-sys-color-on-primary)',
              'on-secondary': 'var(--md-sys-color-on-secondary)',
              'on-tertiary': 'var(--md-sys-color-on-tertiary)',
              'on-surface': 'var(--md-sys-color-on-surface)',
              'on-surface-variant': 'var(--md-sys-color-on-surface-variant)',
              'on-error': 'var(--md-sys-color-on-error)',
              'outline': 'var(--md-sys-color-outline)',
              'outline-variant': 'var(--md-sys-color-outline-variant)',
            }
          }
        }
      },
      fontFamily: {
        'roboto': ['Roboto Flex', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '28px',
        'full': '9999px',
      },
      boxShadow: {
        'elevation-1': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'elevation-2': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
        'elevation-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
        'elevation-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'ripple': 'ripple 600ms linear',
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
      },
      keyframes: {
        ripple: {
          to: {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        slideUp: {
          from: {
            transform: 'translateY(10px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}