import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neo-Savannah Cyberpunk Colors
        "savanna-green": "#2E8B57",
        terracotta: "#E2725B",
        "savanna-gold": "#FFD700",
        "sky-blue": "#87CEEB",

        // Earthy Neutrals
        sunburnt: "#CD853F",
        "deep-terracotta": "#A0522D",
        khaki: "#8B7355",

        // Neon Accents
        "electric-amber": "#FFB000",
        "holographic-green": "#00FF9F",
        "glowing-blue": "#00D4FF",
        "digital-purple": "#B048FF",
        "hot-pink": "#FF0080",

        // Metallic Undertones
        brass: "#B5651D",
        copper: "#B87333",
        chrome: "#C0C0C0",
        "cyber-black": "#0D0D0D",

        // Cyberpunk Effects
        "cyber-grid": "#00FF9F33",
        "neon-glow": "#00D4FF80",
        "scan-amber": "#FFB00050",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        // Neo-Savannah Cyberpunk Animations
        glitch: {
          "0%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-2px)" },
          "40%": { transform: "translateX(2px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
          "100%": { transform: "translateX(0)" },
        },
        hologram: {
          "0%, 100%": {
            opacity: "0.8",
            transform: "translateY(0px)",
            filter: "hue-rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "translateY(-2px)",
            filter: "hue-rotate(90deg)",
          },
        },
        scanlines: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "cyber-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0, 255, 159, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(0, 255, 159, 0.8)",
          },
        },
        "neon-flicker": {
          "0%, 100%": { opacity: "1" },
          "2%": { opacity: "0.8" },
          "4%": { opacity: "1" },
          "6%": { opacity: "0.9" },
          "8%": { opacity: "1" },
        },
        "quantum-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "data-stream": {
          "0%": {
            transform: "translateX(-100%) translateY(0)",
            opacity: "0",
          },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": {
            transform: "translateX(100%) translateY(-10px)",
            opacity: "0",
          },
        },
        materialize: {
          "0%": {
            opacity: "0",
            transform: "scale(0.8) rotateY(90deg)",
            filter: "blur(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) rotateY(0deg)",
            filter: "blur(0px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s ease-out",
        // Neo-Savannah Animations
        glitch: "glitch 0.3s ease-in-out infinite",
        hologram: "hologram 2s ease-in-out infinite",
        scanlines: "scanlines 2s linear infinite",
        "cyber-pulse": "cyber-pulse 2s ease-in-out infinite",
        "neon-flicker": "neon-flicker 3s ease-in-out infinite",
        "quantum-spin": "quantum-spin 3s ease-in-out infinite",
        "data-stream": "data-stream 2s ease-in-out infinite",
        materialize: "materialize 0.8s ease-out forwards",
      },
      fontFamily: {
        cyber: ["Orbitron", "Space Grotesk", "monospace"],
        digital: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 255, 159, 0.5)",
        "neon-strong": "0 0 40px rgba(0, 255, 159, 0.8)",
        "cyber-glow": "0 0 30px rgba(0, 212, 255, 0.6)",
        hologram: "0 0 50px rgba(176, 72, 255, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
