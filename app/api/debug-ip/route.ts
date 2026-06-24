import { NextRequest, NextResponse } from 'next/server'
import { resolveClientIp, isPrivateIp, normalizeIp } from '@/lib/resolve-ip'

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
  const resolvedIp = await resolveClientIp(request)

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    trustProxyConfig: true,
    resolvedIp,
    resolvedIpIsPrivate: isPrivateIp(resolvedIp),
    sources: {
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
        : 'IP resolved successfully.',
      nextJsIpIsPrivate: isPrivateIp(nextJsIp)
        ? 'request.ip is private — trustProxy may not be enabled or proxy is not setting X-Forwarded-For'
        : 'request.ip has the real client IP (trustProxy is working)',
    },
  })
}
