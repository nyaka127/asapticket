/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#004b91',
          secondary: '#ffc107',
          dark: '#003366',
          bg: '#f8fafc',
          sidebar: '#002855'
        }
      }
    }
  },
  plugins: []
};
