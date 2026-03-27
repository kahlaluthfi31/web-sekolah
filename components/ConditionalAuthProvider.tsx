"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"

export function ConditionalAuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) return <>{children}</>
  return <SessionProvider>{children}</SessionProvider>
}
