import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
    const [theme, setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const stored = localStorage.getItem("theme") as Theme | null;

        if (stored) {
            setTheme(stored);
            document.documentElement.setAttribute("data-theme", stored);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const systemTheme: Theme = prefersDark ? "dark" : "light";
            setTheme(systemTheme);
            document.documentElement.setAttribute("data-theme", systemTheme);
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme: Theme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
    };

    return { theme, toggleTheme };
}
