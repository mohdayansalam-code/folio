import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="btn-stroke flex items-center gap-2 px-3 py-2"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <>
                    <Sun size={16} />
                    <span className="hidden md:inline">Light</span>
                </>
            ) : (
                <>
                    <Moon size={16} />
                    <span className="hidden md:inline">Dark</span>
                </>
            )}
        </button>
    );
}
