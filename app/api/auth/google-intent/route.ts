import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') === 'register' ? 'register' : 'login'

  const res = NextResponse.json({ ok: true, mode })
  res.cookies.set('google_intent', mode, {
    path: '/',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax',
  })

  return res
}
