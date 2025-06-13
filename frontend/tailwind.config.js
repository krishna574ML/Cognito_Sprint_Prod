/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-primary': '#4F46E5',      // A strong indigo for buttons, active states
        'brand-primary-light': '#EEF2FF', // A light version for backgrounds
        'status-blocked': '#EF4444',     // Red for blocked tasks
        'status-review': '#F59E0B',      // Amber for tasks in review
        'status-done': '#10B981',       // Emerald/Green for completed tasks
        'neutral-light': '#F8FAFC',     // An off-white for the main background (slate-50)
        'neutral-medium': '#E2E8F0',    // A light grey for borders (slate-200)
        'neutral-dark': '#334155',      // A dark grey for primary text (slate-700)
      },
    },
  },
  plugins: [],
}