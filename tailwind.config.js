/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary, #004b91)',
          secondary: 'var(--brand-secondary, #ffc107)',
          dark: '#003366',
          bg: '#f8fafc',
          sidebar: '#002855'
        }
      }
    }
  },
  plugins: []
};
