module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F4F5F8',
        surface: '#F4F5F8',
        card: '#FFFFFF',
        primary: '#1D63ED',
        'primary-dark': '#0B4AD1',
        'primary-soft': '#E5EDFD',
        'moby-blue': '#2B73FA',
        accent: '#10B981',
        'accent-soft': '#ECFDF5',
        warning: '#FF7A00',
        'warning-soft': '#FFF4EB',
        'warning-border': '#FFE0C3',
        'on-surface': '#141B2B',
        'on-surface-variant': '#64748B',
        'outline-soft': '#E2E8F0',
        track: '#F1F5F9',
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
        '2xl': '20px',
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
