// /** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,ts,js}"],
  prefix: "tw-",
  darkMode: "media",
  theme: {
    screens: {
      xs: "480",
      sm: "768px",
      md: "992px",
      lg: "1024px",
      xl: "1200px",
      "2xl": "1480px",
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#fff',
      'purple': '#3f3cbb',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      'red': '#d70018',
      'black': '#212121',
      'yellow': '#ffc400',
      'success': '#28a745',
      'error': '#dc3545',
      'warning': '#ffc107',
      'info': '#17a2b8',
      // Thêm gray vào theme.colors chính để Tailwind nhận diện
      'gray': {
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
        950: '#0c0a09'
      },
      // Thêm stone vào theme.colors chính để Tailwind nhận diện
      'stone': {
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
        950: '#0c0a09',
      },
      // Thêm crimson, sky, emerald vào theme.colors chính
      'crimson': {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
      },
      'sky': {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      'emerald': {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
      },
    },
    borderRadius: {
      none: "0",
      xs: ".125rem",
      sm: ".375rem",
      DEFAULT: "0.5rem",
      lg: ".5rem",
      xl: "1rem",
      full: "9999px",
    },
    fontSize: {
      xxs: "0.625rem", // 10px
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "0.875rem", // 14px
      md: "1.125rem", // 18px
      lg: "1.25rem", // 20px
      xl: "1.5625rem", // 25px
      "2xl": "1.75rem", // 28px
      "3xl": "2rem", // 32px
      "4xl": "2.375rem", // 38px
      "13px": "13px",
    },
    fontWeight: {
      thin: '100',
      hairline: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      'extra-bold': '800',
      black: '900',
    },
    extend: {
      borderWidth: {
        DEFAULT: '1px',
        0: '0px',
        2: '2px',
        4: '4px',
        8: '8px',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active", "disabled"],
      textColor: ["disabled"],
      borderColor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};