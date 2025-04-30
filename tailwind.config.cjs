/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");


module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
     
        colors: {
        primary: "#38b6ff",
        secondary: "#002159",
        dark: "#343a40",
        light: "#FFF",
        tertiary: "#feaa47"
      },
    
      backgroundImage: {
        bg1: "url('/src/assets/graphics/bg1.jpg')",
        bg2: "url('/src/assets/graphics/bg-2.jpg')",
        chatBg: "url('/src/assets/graphics/chat.jpg')",
        hero: "url('/src/assets/graphics/hero.avif')",
        onlineExam: "url('/src/assets/graphics/exam3.avif')",
        onlineCourse: "url('/src/assets/graphics/courseB.avif')",
        dissertation: "url('/src/assets/graphics/the1.avif')",
        dissertation2: "url('/src/assets/graphics/the2.avif')",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5715" }],
        base: ["1rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        lg: ["1.125rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        xl: ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "3xl": ["1.88rem", { lineHeight: "1.33", letterSpacing: "-0.01em" }],
        "4xl": ["2.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
      },
      screens: {
        xs: "480px",
      },
      borderWidth: {
        3: "3px",
      },
      minWidth: {
        36: "9rem",
        44: "11rem",
        56: "14rem",
        60: "15rem",
        72: "18rem",
        80: "20rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        60: "60",
      },
      expertHero: "url('/src/assets/graphics/expertsHero.jpg')",

    },
  },
  plugins: [],
});

