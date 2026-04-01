module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
        secondary: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
        upsc: { light: '#f3e8ff', DEFAULT: '#9333ea', dark: '#581c87' },
        ssc: { light: '#dbeafe', DEFAULT: '#2563eb', dark: '#1e3a8a' },
        banking: { light: '#dcfce7', DEFAULT: '#16a34a', dark: '#14532d' },
        railways: { light: '#fee2e2', DEFAULT: '#dc2626', dark: '#7f1d1d' },
        defence: { light: '#fef3c7', DEFAULT: '#d97706', dark: '#78350f' },
        statepsc: { light: '#ffedd5', DEFAULT: '#ea580c', dark: '#7c2d12' },
        teaching: { light: '#fce7f3', DEFAULT: '#db2777', dark: '#831843' },
        police: { light: '#e0e7ff', DEFAULT: '#4f46e5', dark: '#312e81' },
        insurance: { light: '#ccfbf1', DEFAULT: '#0d9488', dark: '#134e4a' },
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'slideUp': 'slideUp 0.6s ease-out forwards',
        'slideDown': 'slideDown 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    }
  },
  plugins: []
}
