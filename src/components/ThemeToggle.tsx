
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full w-9 h-9"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-game-dark" />
      ) : (
        <Sun className="h-5 w-5 text-game-accent" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
