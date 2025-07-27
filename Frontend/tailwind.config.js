/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // blue
        secondary: '#6366F1', // indigo
        accent: '#10B981', // green
        background: {
          light: '#F9FAFB',
          dark: '#111827',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        modernclean: {
          'primary': '#3B82F6',
          'secondary': '#6366F1',
          'accent': '#10B981',
          'base-100': '#FFFFFF',
          'base-200': '#F9FAFB',
          'base-300': '#F3F4F6',
          'base-content': '#111827',
          'neutral': '#E5E7EB',
          'info': '#3B82F6',
          'success': '#10B981',
          'warning': '#F59E42',
          'error': '#EF4444',
        },
        modernclean_dark: {
          'primary': '#3B82F6',
          'secondary': '#6366F1',
          'accent': '#10B981',
          'base-100': '#111827',
          'base-200': '#1F2937',
          'base-300': '#374151',
          'base-content': '#F9FAFB',
          'neutral': '#1F2937',
          'info': '#3B82F6',
          'success': '#10B981',
          'warning': '#F59E42',
          'error': '#EF4444',
        },
      },
    ],
    darkTheme: 'modernclean_dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
  },
} 