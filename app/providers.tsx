"use client"

import type React from "react"

import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { loadAllApiKeys } from "@/lib/api-storage"

export function Providers({ children }: { children: React.ReactNode }) {
  // Tải tất cả API keys khi ứng dụng khởi động
  useEffect(() => {
    loadAllApiKeys()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
