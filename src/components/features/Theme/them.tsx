"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-9 w-9 rounded-xl bg-gray-200/50 animate-pulse" />
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 items-center gap-2 overflow-hidden rounded-xl border border-emerald-200/50 bg-white/40 p-1.5 md:pl-2 md:pr-3 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-400 dark:border-emerald-800/50 dark:bg-zinc-900/40"
    >
      {/* Icon Section */}
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" fill="currentColor" />
        )}
      </div>

     
      <span className="hidden md:block text-xs font-bold tracking-tight text-slate-600 dark:text-slate-300">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  )
}