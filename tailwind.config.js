// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "pulse-glow": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(224, 123, 26, 0.7)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 30px 15px rgba(224, 123, 26, 0.3)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(224, 123, 26, 0)",
          },
        },
        "pulse-glow-fast": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(224, 123, 26, 0.7)",
          },
          "30%": {
            transform: "scale(1.08)",
            boxShadow: "0 0 25px 12px rgba(224, 123, 26, 0.4)",
          },
          "60%": {
            transform: "scale(0.95)",
            boxShadow: "0 0 10px 5px rgba(224, 123, 26, 0.2)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(224, 123, 26, 0)",
          },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-glow-fast": "pulse-glow-fast 1.5s ease-in-out infinite",
      },
    },
  },
};
