export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        or: "#D4AF37",
        terracotta: "#C45C26",
        creme: "#FFF8F0",
        emeraude: "#2D6A4F",
        sombre: "#1A0A00",
      },
      fontFamily: {
        elegant: ["Playfair Display", "serif"],
        moderne: ["Inter", "sans-serif"],
      },
      animation: {
        flottant: "flottant 3s ease-in-out infinite",
        brillant: "brillant 2s ease-in-out infinite",
        particule: "particule 6s linear infinite",
      },
      keyframes: {
        flottant: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        brillant: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        particule: {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: 1 },
          "100%": { transform: "translateY(-100vh) rotate(720deg)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
