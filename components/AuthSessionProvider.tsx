'use client'

import type { ReactNode } from 'react'

// Lightweight no-op provider to avoid next-auth client fetch errors. The app uses
// custom cookie-based auth in `lib/auth`, so we don't need SessionProvider here.
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
