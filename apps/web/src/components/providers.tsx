"use client"

import { ThemeProvider } from "next-themes"
import { StoreProvider } from "@/lib/store"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </StoreProvider>
    </ThemeProvider>
  )
}
