"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ChatHeader() {
  const { toggleSidebar } = useSidebar()
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
