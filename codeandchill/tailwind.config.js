/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // use "class" strategy for dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        // use CSS vars defined in index.css (shadcn standard)
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        platform: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
        "platform-hover":
          "0 10px 15px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.1)",
        neon: "0 0 10px rgba(109, 40, 217, 0.7), 0 0 20px rgba(37, 99, 235, 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        gradient: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient 15s ease infinite",
        "gradient-y": "gradient 15s ease infinite",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
      backgroundImage: {
        "dark-gradient":
          "linear-gradient(270deg, #0f2027, #203a43, #2c5364)",
        "aurora-gradient":
          "linear-gradient(270deg, #0f0c29, #302b63, #24243e)",
        "cyberpunk-gradient":
          "linear-gradient(270deg, #ff0080, #7928ca, #2c3e50)",
        "galaxy-gradient":
          "linear-gradient(270deg, #0f0f0f, #1c1c1c, #2d2d2d, #111)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
