const ipMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60_000 // 1 minuto
const MAX_ATTEMPTS = 5

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = ipMap.get(ip)

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: WINDOW_MS }
  }

  entry.count++

  if (entry.count > MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, resetIn: entry.resetAt - now }
}
