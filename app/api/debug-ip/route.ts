import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, isPrivateIp, normalizeIp } from '@/lib/resolve-ip'

/**
 * Debug endpoint: GET /api/debug-ip
 *
 * Visiting this URL on the deployed server shows exactly what the
 * server sees — all proxy headers and the final resolved IP.
 *
 * DELETE THIS FILE after debugging!
 */
export async function GET(request: NextRequest) {
  const allHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    allHeaders[key] = value
  })

  const proxyHeaders = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'x-client-ip': request.headers.get('x-client-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
    'true-client-ip': request.headers.get('true-client-ip'),
    'forwarded': request.headers.get('forwarded'),
    'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
    'x-forwarded-host': request.headers.get('x-forwarded-host'),
    'x-forwarded-port': request.headers.get('x-forwarded-port'),
  }

  const nextJsIp = normalizeIp((request as unknown as { ip?: string }).ip)
  const socketIp = normalizeIp(
    (request as unknown as { socket?: { remoteAddress?: string } }).socket?.remoteAddress
  )
  // This uses headers() from next/headers — the reliable way behind Nginx
  const resolvedIp = await getClientIp()

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    resolvedIp,
    resolvedIpIsPrivate: isPrivateIp(resolvedIp),
    sources: {
      headersBased: resolvedIp,
      nextJsRequestIp: nextJsIp,
      socketRemoteAddress: socketIp,
    },
    proxyHeaders,
    allRequestHeaders: allHeaders,
    hints: {
      allPrivate: isPrivateIp(resolvedIp)
        ? 'ALL sources return private IP. The reverse proxy (Nginx/Apache) is NOT forwarding the real client IP. ' +
          'Check your proxy config for: proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; ' +
          'and proxy_set_header X-Real-IP $remote_addr;'
        : 'IP resolved successfully via headers() from next/headers.',
    },
  })
}
