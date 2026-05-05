import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

function isNewDay(lastReset: Date) {
    const now = new Date();
    return (
        now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
        now.getUTCMonth() !== lastReset.getUTCMonth() ||
        now.getUTCDate() !== lastReset.getUTCDate()
    );
}

export async function POST(request: Request) {
    try {

        const ip = request.headers.get("x-forwarded-for") || "anonymous";
        const ratelimitKey = `ratelimit:views:${ip}`;

        const currentRequests = await redis.incr(ratelimitKey);
        
        if (currentRequests === 1) {
            await redis.expire(ratelimitKey, 300); // 5mins
        }

        if (currentRequests > 1) {
            return new NextResponse("Rate limit exceeded. Try again in 1 minute.", { 
                status: 429 
            });
        }

        const stats = await prisma.siteStats.findUnique({
            where: { id: "views" },
        });

        // First visit ever
        if (!stats) {
            const created = await prisma.siteStats.create({
                data: {
                    id: "views",
                    totalViews: 1,
                    dailyViews: 1,
                    lastReset: new Date(),
                },
            });

            return NextResponse.json(created);
        }

        // New day → reset daily counter
        if (isNewDay(stats.lastReset)) {
            const updated = await prisma.siteStats.update({
                where: { id: "views" },
                data: {
                    totalViews: { increment: 1 },
                    dailyViews: 1,
                    lastReset: new Date(),
                },
            });

            return NextResponse.json(updated);
        }

        // Same day → normal increment
        const updated = await prisma.siteStats.update({
            where: { id: "views" },
            data: {
                totalViews: { increment: 10 },
                dailyViews: { increment: 10 },
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return new NextResponse("INTERNAL SERVER ERROR", {
            status: 500
        });
    }
}

export async function GET() {
    try {
        const stats = await prisma.siteStats.findUnique({
            where: { id: "views" },
        });

        return NextResponse.json({
            total: stats?.totalViews ?? 0,
            today: stats?.dailyViews ?? 0,
        });

    } catch (error) {
        return new NextResponse("INTERNAL SERVER ERROR", {
            status: 500
        });
    }
}
