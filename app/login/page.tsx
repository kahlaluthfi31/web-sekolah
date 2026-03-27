import { redirect } from 'next/navigation'

import { auth } from '../api/auth/[...nextauth]/route'
import LoginClient from './LoginClient'

export default async function UserLoginPage() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return <LoginClient />
}
