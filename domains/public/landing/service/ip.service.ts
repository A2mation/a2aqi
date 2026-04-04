import { NextRequest } from "next/server"

export class IPServices {
    public normalizeIp(ip: string | null): string | null {
        if (!ip) return null
        if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "")
        return ip
    }

    public isPrivateIp(ip: string): boolean {
        return (
            ip === "::1" ||
            ip === "127.0.0.1" ||
            ip.startsWith("192.168.") ||
            ip.startsWith("10.") ||
            ip.startsWith("172.")
        )
    }

    public getClientIp(req: NextRequest): string {
        const raw =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip")
    
        // console.log(`Raw client IP: ${raw}`)
    
        const ip = this.normalizeIp(raw)
    
        // Local/private → fallback (Kolkata, India)
        if (!ip || this.isPrivateIp(ip)) return "122.163.120.226"
    
        return ip
    }
}