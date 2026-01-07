const rateMap = new Map<string, number>()

const RATE_LIMIT = 30

export function rateLimit(ip: string): boolean {
    const count = rateMap.get(ip) ?? 0
    if (count > RATE_LIMIT) return false // 30 req/min

    rateMap.set(ip, count + 1)
    
    setTimeout(() => rateMap.delete(ip), 60_000)
    return true
}