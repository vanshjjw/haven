const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // --- Base Palette (Earthy Tones) ---
        brand: {
          light: '#FAF0E6',     // Linen - Main background
          tan_light: '#EAE0D5', // Lighter Tan - Muted backgrounds
          tan: '#D2B48C',       // Tan - Borders, secondary elements
          tan_dark: '#B89A74',  // Darker Tan
          brown_light: '#B5651D',// Lighter Sienna
          brown: '#A0522D',     // Sienna - Primary actions
          brown_dark: '#8B4513' // Saddle Brown - Dark accents
        },
        white: '#FFFFFF',        // Pure white for cards/surfaces
        black: '#000000',

        // --- Semantic Roles --- 
        background: {
          DEFAULT: '#FAF0E6',  // Use brand.light as default bg
          surface: '#FFFFFF',  // White for cards, modals etc.
          muted: '#EAE0D5',    // Use brand.tan_light for muted areas
        },
        foreground: {          // Text colors
          DEFAULT: '#44403C',  // Default text (stone-800)
          secondary: '#78716C',// Secondary text (stone-500)
          muted: '#A8A29E',    // Muted text (stone-400)
          on_primary: '#FFFFFF', // Text on primary color background
          on_accent: '#000000',  // Text on accent color background
        },
        primary: {
          DEFAULT: '#A0522D',  // Brand brown as default primary
          hover: '#B5651D',    // Lighter brown for hover
          // foreground: '#FFFFFF' // Implicitly handled by text-on-primary
        },
        secondary: {
          DEFAULT: '#D2B48C',  // Brand tan as default secondary
          hover: '#B89A74',    // Darker tan for hover
          // foreground: '#44403C' // Implicitly handled by text-primary
        },
        accent: {
          DEFAULT: '#f59e0b',  // Amber
          hover: '#fde047'     // Lighter Amber (yellow-300)
          // foreground: '#000000' // Implicitly handled by text-on-accent
        },
        border: {
          DEFAULT: '#D2B48C',  // Brand tan for default borders
          muted: '#EAE0D5',    // Lighter tan for subtle borders
        },
        // Optional: Add status colors if needed
        success: '#16a34a', // green-600
        warning: '#facc15', // yellow-400
        error: '#dc2626',   // red-600

        // --- Remove old direct definitions --- 
        // 'brand-brown': '#A0522D', // Replaced by brand.brown
        // 'brand-tan': '#D2B48C',   // Replaced by brand.tan
        // 'brand-light': '#FAF0E6', // Replaced by brand.light & background.DEFAULT
        // 'accent-amber': '#f59e0b', // Replaced by accent.DEFAULT
        // 'text-primary': '#44403C', // Replaced by foreground.DEFAULT
        // 'text-secondary': '#78716C', // Replaced by foreground.secondary
      },
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans], 
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif], 
      },
      // Optional: Define standard border radius if needed
      // borderRadius: {
      //   'base': defaultTheme.borderRadius.lg, // Example: use large as default
      // }
      // Optional: Define standard spacing if needed
    },
  },
  plugins: [],
}

