module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: { brand: "#e11d48" },
      borderRadius: { "2xl": "1rem" }
    }
  },
  plugins: []
};
