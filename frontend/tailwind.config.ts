import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                "background-dim": "var(--background-dim)",
                foreground: "var(--foreground)",
                "foreground-secondary": "var(--foreground-secondary)",
                "foreground-muted": "var(--foreground-muted)",
                primary: "var(--primary)",
                border: "var(--border)",
            },
            borderRadius: {
                xs: "var(--radius-xs)",
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
            },
            fontFamily: {
                sans: "var(--font-sans)",
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

export default config;