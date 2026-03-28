"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"

export function ConditionalAuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const protocol = typeof window !== "undefined" ? window.location.protocol : ""
  const isFileOrUnsupported = protocol && !protocol.startsWith("http")
  const disableAuth = typeof window !== "undefined" && (window as unknown as { __DISABLE_AUTH__?: boolean }).__DISABLE_AUTH__

  // If running from file://, non-http protocol, explicitly disabled, or in admin, skip SessionProvider to avoid failing session fetch
  if (isAdmin || isFileOrUnsupported || disableAuth) return <>{children}</>
  return <SessionProvider>{children}</SessionProvider>
}
