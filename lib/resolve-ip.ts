import { NextRequest } from 'next/server'

/**
 * Shared IP resolution & geo-lookup helpers.
 *
 * Handles common reverse-proxy / CDN / load-balancer setups where the
 * raw socket address is 127.0.0.1 and the real client IP lives in
 * one of several forwarding headers.
 *
 * Set TRUSTED_PROXIES env (comma-separated CIDRs or exact IPs) if your
 * proxy chain adds its own addresses to x-forwarded-for and you need
 * to skip them when picking the client IP.
 */

// --------------- IP helpers ---------------

export function isPrivateIp(ip: string | null | undefined): boolean {
  if (!ip) return true
  return (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.20.') ||
    ip.startsWith('172.21.') ||
    ip.startsWith('172.22.') ||
    ip.startsWith('172.23.') ||
    ip.startsWith('172.24.') ||
    ip.startsWith('172.25.') ||
    ip.startsWith('172.26.') ||
    ip.startsWith('172.27.') ||
    ip.startsWith('172.28.') ||
    ip.startsWith('172.29.') ||
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    ip.startsWith('169.254.') ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('fe80:') ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === '0.0.0.0' ||
    ip === '::'
  )
}

export function normalizeIp(raw: string | null | undefined): string | null {
  if (!raw) return null
  let ip = raw.trim()
  if (!ip) return null

  // x-forwarded-for entry might include port (e.g. 1.2.3.4:1234)
  if (ip.includes(':') && ip.includes('.') && !ip.startsWith('::ffff:')) {
    const parts = ip.split(':')
    if (parts.length === 2) ip = parts[0]
  }

  // Strip IPv4-mapped IPv6 prefix
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }

  return ip || null
}

/** Parse the standard RFC 7239 "Forwarded" header into a list of IPs. */
function parseForwardedHeader(headerValue: string | null): string[] {
  if (!headerValue) return []
  // Example: Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43, for=198.51.100.17
  const ips: string[] = []
  const parts = headerValue.split(',')
  for (const part of parts) {
    const forMatch = part.match(/for\s*=\s*"?([^";,\s]+)"?/i)
    if (forMatch) {
      const ip = normalizeIp(forMatch[1])
      if (ip) ips.push(ip)
    }
  }
  return ips
}

/**
 * Parse x-forwarded-for into a list of candidate IPs,
 * left-to-right (client first, proxies appended).
 */
function parseXForwardedFor(headerValue: string | null): string[] {
  if (!headerValue) return []
  return headerValue
    .split(',')
    .map((entry) => normalizeIp(entry))
    .filter(Boolean) as string[]
}

/** Build the list of trusted proxy IPs/CIDRs from env. */
function getTrustedProxies(): string[] {
  const raw = process.env.TRUSTED_PROXIES
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function isTrustedProxy(ip: string, trustedList: string[]): boolean {
  if (trustedList.length === 0) return false
  return trustedList.some((proxy) => {
    if (proxy === ip) return true
    // Simple CIDR match for /24 style
    if (proxy.includes('/')) {
      const [base] = proxy.split('/')
      const baseParts = base.split('.')
      const ipParts = ip.split('.')
      if (baseParts.length === 4 && ipParts.length === 4) {
        // match first 3 octets for /24, first 2 for /16, etc.
        const cidr = parseInt(proxy.split('/')[1], 10)
        const octets = Math.floor(cidr / 8)
        for (let i = 0; i < octets; i++) {
          if (baseParts[i] !== ipParts[i]) return false
        }
        return true
      }
    }
    return false
  })
}

/**
 * Pick the first public (non-private, non-trusted-proxy) IP from a list.
 * Returns null if no public IP is found (caller should try other sources).
 */
function pickPublicIp(candidates: string[], trustedProxies: string[]): string | null {
  if (candidates.length === 0) return null

  // First: try to find a public IP that's not a trusted proxy
  const publicIp = candidates.find(
    (ip) => !isPrivateIp(ip) && ip.toLowerCase() !== 'unknown' && !isTrustedProxy(ip, trustedProxies)
  )
  if (publicIp) return publicIp

  // Second: try right-to-left (proxy-added order), skip trusted proxies
  for (let i = candidates.length - 1; i >= 0; i--) {
    const ip = candidates[i]
    if (!isPrivateIp(ip) && ip.toLowerCase() !== 'unknown' && !isTrustedProxy(ip, trustedProxies)) {
      return ip
    }
  }

  // Return null if no public IP found — do NOT fall back to a private IP
  // (127.0.0.1 from x-forwarded-for is the proxy itself, not the client)
  return null
}

// --------------- Main export ---------------

/**
 * Resolve the real client IP address from a Next.js request.
 *
 * Checks headers in priority order:
 *   1. cf-connecting-ip   (Cloudflare)
 *   2. true-client-ip     (Akamai / some CDNs)
 *   3. x-real-ip          (Nginx default)
 *   4. x-client-ip        (some load balancers)
 *   5. forwarded           (RFC 7239 standard)
 *   6. x-forwarded-for    (de-facto standard, with trusted-proxy filtering)
 *   7. Next.js request.ip  (Vercel / serverless)
 *   8. socket.remoteAddress (direct connection)
 *
 * In development, falls back to the machine's public IP via ipify.
 */
export async function resolveClientIp(request: NextRequest): Promise<string> {
  const trustedProxies = getTrustedProxies()

  // --- Debug: log all proxy-related headers (once per request) ---
  const debugIp = process.env.DEBUG_IP === 'true' || process.env.NODE_ENV !== 'production'
  if (debugIp) {
    const hdrs: Record<string, string | null> = {}
    for (const key of [
      'x-forwarded-for', 'x-real-ip', 'x-client-ip',
      'cf-connecting-ip', 'true-client-ip', 'forwarded',
      'x-forwarded-proto', 'x-forwarded-host',
    ]) {
      hdrs[key] = request.headers.get(key)
    }
    console.log('[resolve-ip] headers:', JSON.stringify(hdrs))
  }

  // 1) CDN-specific single-IP headers (highest trust — always accurate)
  const cfConnecting = normalizeIp(request.headers.get('cf-connecting-ip'))
  const trueClientIp = normalizeIp(request.headers.get('true-client-ip'))
  const xRealIp = normalizeIp(request.headers.get('x-real-ip'))
  const xClientIp = normalizeIp(request.headers.get('x-client-ip'))

  // 2) RFC 7239 Forwarded header
  const forwardedIps = parseForwardedHeader(request.headers.get('forwarded'))

  // 3) x-forwarded-for (with trusted-proxy filtering)
  const xffIps = parseXForwardedFor(request.headers.get('x-forwarded-for'))

  // 4) Next.js request.ip — reliable when trustProxy: true is set in next.config
  //    With trustProxy, Next.js parses x-forwarded-for itself and returns the
  //    first public IP.  This is often the MOST accurate source.
  const nextJsIp = normalizeIp((request as unknown as { ip?: string }).ip)

  // 5) socket.remoteAddress — last resort (always the proxy's IP in production)
  const socketIp = normalizeIp(
    (request as unknown as { socket?: { remoteAddress?: string } }).socket?.remoteAddress
  )

  if (debugIp) {
    console.log('[resolve-ip] candidates:', JSON.stringify({
      cfConnecting, trueClientIp, xRealIp, xClientIp,
      forwardedIps, xffIps, nextJsIp, socketIp,
    }))
  }

  // Build ordered candidate groups
  const cdnCandidates = [cfConnecting, trueClientIp, xRealIp, xClientIp].filter(Boolean) as string[]
  const listCandidates = [...forwardedIps, ...xffIps]
  const runtimeCandidates = [nextJsIp].filter(Boolean) as string[]
  const socketCandidates = [socketIp].filter(Boolean) as string[]

  // Resolution order:
  //   CDN headers (always trust) > forwarded lists (skip private) >
  //   request.ip (trustProxy-aware) > socket fallback
  let ip: string =
    cdnCandidates.find((c) => !isPrivateIp(c)) ||
    pickPublicIp(listCandidates, trustedProxies) ||
    runtimeCandidates.find((c) => !isPrivateIp(c)) ||
    socketCandidates.find((c) => !isPrivateIp(c)) ||
    // Last resort: any candidate at all (better than 'unknown')
    cdnCandidates[0] ||
    runtimeCandidates[0] ||
    listCandidates[0] ||
    socketCandidates[0] ||
    'unknown'

  // Dev-only: if still private/unknown, try to get the machine's public IP
  if (process.env.NODE_ENV !== 'production' && (isPrivateIp(ip) || ip === 'unknown')) {
    try {
      const res = await fetch('https://api.ipify.org?format=json', { next: { revalidate: 60 } })
      if (res.ok) {
        const data = (await res.json()) as { ip?: string }
        if (data.ip) ip = data.ip
      }
    } catch (err) {
      console.warn('[resolve-ip] Failed to fetch public IP for localhost', err)
    }
  }

  if (debugIp) {
    console.log('[resolve-ip] resolved IP:', ip)
  }

  return ip
}

// --------------- Geo lookup ---------------

/**
 * Look up approximate coordinates for a public IP.
 * Returns null coordinates for private/unknown IPs.
 */
export async function lookupGeo(ip: string | null) {
  const fallback = { latitude: null as number | null, longitude: null as number | null }
  try {
    if (!ip || ip === 'unknown' || isPrivateIp(ip)) return fallback

    // Primary: ipapi.co
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { next: { revalidate: 60 * 60 } })
    if (res.ok) {
      const data = (await res.json()) as { latitude?: number; longitude?: number }
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        return { latitude: data.latitude, longitude: data.longitude }
      }
    }

    // Fallback: ip-api.com
    const res2 = await fetch(`https://ip-api.com/json/${ip}?fields=status,lat,lon`, { next: { revalidate: 60 * 60 } })
    if (res2.ok) {
      const data2 = (await res2.json()) as { status?: string; lat?: number; lon?: number }
      return {
        latitude: typeof data2.lat === 'number' ? data2.lat : null,
        longitude: typeof data2.lon === 'number' ? data2.lon : null,
      }
    }

    return fallback
  } catch (err) {
    console.warn('[resolve-ip] Geo lookup failed', err)
    return fallback
  }
}

// --------------- Convenience ---------------

/**
 * One-call helper: resolves IP + geo + device info from a request.
 * Use this in login handlers or activity loggers.
 */
export async function extractClientInfo(request: NextRequest) {
  const ip = await resolveClientIp(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'

  const device = (() => {
    if (!userAgent || userAgent === 'unknown') return null
    if (/mobile/i.test(userAgent)) return 'Mobile'
    if (/tablet/i.test(userAgent)) return 'Tablet'
    if (/windows/i.test(userAgent)) return 'Windows'
    if (/macintosh|mac os x/i.test(userAgent)) return 'Mac'
    if (/linux/i.test(userAgent)) return 'Linux'
    return userAgent.slice(0, 120)
  })()

  return { ip, userAgent, device }
}
