"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-8 w-8 rounded-lg bg-gray-200/50 animate-pulse" />
  }

  const isDark = theme === "dark"

  return (
    <motion.button
      // Click korle ektu choto hobe (Squish effect)
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 items-center gap-2 overflow-hidden rounded-xl border border-emerald-200/50 bg-white/40 pl-2 pr-3 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-400 dark:border-emerald-800/50 dark:bg-zinc-900/40"
    >
      {/* Icon Section */}
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "dark" : "light"}
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 45, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          >
            {isDark ? (
              <Moon className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" fill="currentColor" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Label - Compact text */}
      <span className="text-xs font-bold tracking-tight text-slate-600 dark:text-slate-300">
        {isDark ? "Dark" : "Light"}
      </span>
    </motion.button>
  )
}