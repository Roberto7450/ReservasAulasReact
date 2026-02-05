/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'geist-foreground': '#000000',
        'geist-background': '#ffffff',
        'geist-accents-1': '#fafafa',
        'geist-accents-2': '#eaeaea',
        'geist-accents-3': '#ccc',
        'geist-accents-4': '#888',
        'geist-accents-5': '#666',
        'geist-accents-6': '#333',
        'geist-accents-7': '#111',
        'geist-accents-8': '#000',
        'geist-success': '#0070f3',
        'geist-success-light': '#3291ff',
        'geist-success-dark': '#0051ba',
        'geist-warning': '#f5a623',
        'geist-error': '#ff0000',
        'geist-error-light': '#ff1a1a',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Roboto"',
          '"Oxygen"',
          '"Ubuntu"',
          '"Cantarell"',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
