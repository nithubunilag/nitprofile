import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: ["class"],

    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },

            fontSize: {
                // xs: "clamp(0.64rem, 2vw, 0.707rem)",
                // sm: "clamp(0.8rem, 2vw, 1rem)",
                // base: "clamp(1rem, 2vw, 1.414rem)",
                // lg: "clamp(1.25rem, 2vw, 1.999rem)",
                // xl: "clamp(1.562rem, 2vw, 2.827rem)",
                // "2xl": "clamp(1.953rem, 1.5vw, 3.997rem)",
                // "3xl": "clamp(2.441rem, 1.5vw, 5.652rem)",
                // "4xl": "clamp(3.051rem, 1.5vw, 7.992rem)",
                // "5xl": "clamp(3.814rem, 1.5vw, 11.302rem)",
            },

            boxShadow: {
                toolbar_button: "0 0 40px 40px #e74c3c inset",
                program_card: "0px 8px 24px 0px rgba(149, 157, 165, 0.2)",
            },

            colors: {
                primary: "#62CF3A",
            },

            gridTemplateColumns: {
                toolbar_buttons_grid: "repeat(auto-fit, minmax(200px, 1fr));",
                image_toolbar_buttons_grid: "repeat(auto-fit, minmax(100px, 1fr));",

            },
        },
    },

    plugins: [],
}
export default config
