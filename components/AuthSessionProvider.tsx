'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

// Global SessionProvider so useSession works across pages/components
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
