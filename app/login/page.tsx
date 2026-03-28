import { Suspense } from 'react'
import LoginClient from './LoginClient'

// Server-side session helpers are not available in this NextAuth beta setup.
// Let the client handle redirect when already authenticated.
export default function UserLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  )
}
