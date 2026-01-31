/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
theme: {
extend: {
colors: {
primary: "#4F46E5", // Indigo-600
primaryDark: "#4338CA",
slateBg: "#F8FAFC",
},
borderRadius: {
xl: "0.75rem",
'2xl': "1rem",
'3xl': "1.5rem",
},
fontFamily: {
sans: ['Inter', 'system-ui', 'sans-serif'],
},
boxShadow: {
soft: "0 10px 25px -5px rgba(0,0,0,0.08)",
primary: "0 10px 20px rgba(79,70,229,0.25)",
}
},
},
plugins: [],
};