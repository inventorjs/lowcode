/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      width: {
        7.5: '30px',
        12.5: '50px',
        25: '100px',
      },
      height: {
        7.5: '30px',
        12.5: '50px',
        25: '100px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}

