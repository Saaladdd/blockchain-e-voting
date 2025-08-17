"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 px-0 transition-all duration-300 hover:bg-accent hover:scale-110 active:scale-95"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div className="relative">
        <Sun
          className={`h-4 w-4 transition-all duration-500 ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
