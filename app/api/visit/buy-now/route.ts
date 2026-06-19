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
        const ratelimitKey = `ratelimit:buy-now:${ip}`;

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ message: "Missing id in request body", error: true }, {
                status: 400
            });
        }

        const updatedId = `buy-now:${id}`;

        const currentRequests = await redis.incr(ratelimitKey);

        if (currentRequests === 1) {
            await redis.expire(ratelimitKey, 5);
        }

        if (currentRequests > 1) {
            return NextResponse.json({ message: "Rate limit exceeded. Try again in 1 minute.", error: true }, {
                status: 429
            });
        }

        const stats = await prisma.siteStats.findUnique({
            where: { id: updatedId },
        });

        // First visit ever
        if (!stats) {
            const created = await prisma.siteStats.create({
                data: {
                    id: updatedId,
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
                where: { id: updatedId },
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
            where: { id: updatedId },
            data: {
                totalViews: { increment: 1 },
                dailyViews: { increment: 1 },
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "INTERNAL SERVER ERROR", error: true }, {
            status: 500
        });
    }
}

export async function GET() {
    try {
        const stats = await prisma.siteStats.findMany({
            where: {
                id: {
                    startsWith: "buy-now:"
                }
            }
        });

        return NextResponse.json(stats);

    } catch (error) {
        return NextResponse.json({ message: "INTERNAL SERVER ERROR", error: true }, {
            status: 500
        });
    }
}
