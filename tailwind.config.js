module.exports = {
  purge: [
    './src/**/*.{vue,js,ts,jsx,tsx,html}',
    './src/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial Rounded MT Bold', 'Arial Rounded MT', 'Helvetica Rounded', 'Arial', 'sans-serif'],
        rounded: ['Arial Rounded MT Bold', 'Arial Rounded MT', 'Helvetica Rounded', 'Arial', 'sans-serif'],
      },
      colors: {
        // Mad Games Tycoon 2 Color System
        primary: {
          blue: '#1E88E5',
          red: '#D62828',
          green: '#2E7D32',
          yellow: '#F6C445',
          turquoise: '#25C2C2',
        },
        neutral: {
          'bg-light': '#F4F6F8',
          panel: '#FFFFFF',
          line: '#D9E1E8',
          'text-primary': '#1B1F23',
          'text-secondary': '#5A6B7A',
        },
        // Semantic colors
        cta: '#1E88E5',
        success: '#2E7D32',
        warning: '#F6C445',
        error: '#D62828',
        highlight: '#25C2C2',
        // Additional theme colors
        'panel-header': '#EAF2FB',
        'row-stripe': '#FAFBFC',
        'progress-bg': '#E6ECF1',
        'success-bg': '#E6F4EA',
        'warning-bg': '#FFF7E1',
        'error-bg': '#FDEAEA',
        'info-bg': '#EAF2FB',
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        'tycoon': '8px',
        'button': '12px',
        'chip': '12px',
        'progress': '6px',
      },
      boxShadow: {
        'tycoon': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'button': '0 4px 10px rgba(0, 0, 0, 0.2)',
        'hover': '0 6px 16px rgba(0, 0, 0, 0.15)',
        'press': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'logo': '0 4px 10px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'hover-lift': 'hoverLift 150ms ease-out',
        'press': 'press 100ms ease-out',
        'fade-in': 'fadeIn 200ms ease-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}