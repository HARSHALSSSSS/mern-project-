/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
          primary: {
            50: '#f5f7fa',
            100: '#e4e9f2',
            200: '#c5cee0',
            300: '#8f9bb3',
            400: '#2e3a59',
            500: '#222b45',
            600: '#1a2138',
            700: '#151a30',
            800: '#101426',
            900: '#0a0f19',
          },
          accent: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          success: {
            100: '#d1fae5',
            500: '#10b981',
          },
          warning: {
            100: '#fef3c7',
            500: '#f59e42',
          },
          error: {
            100: '#fee2e2',
            500: '#ef4444',
          },
          neutral: {
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
      },
        fontFamily: {
          sans: ['Poppins', 'Nunito', 'Inter', 'system-ui', 'sans-serif'],
        },
        borderRadius: {
          DEFAULT: '1rem',
          lg: '1.5rem',
          xl: '2rem',
        },
        boxShadow: {
          card: '0 4px 24px 0 rgba(34, 43, 69, 0.08)',
          btn: '0 2px 8px 0 rgba(249, 115, 22, 0.12)',
        },
    },
  },
  plugins: [],
}
