import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function isNewDay(lastReset: Date) {
    const now = new Date();
    return (
        now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
        now.getUTCMonth() !== lastReset.getUTCMonth() ||
        now.getUTCDate() !== lastReset.getUTCDate()
    );
}

export async function POST() {
    try {

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
                totalViews: { increment: 1 },
                dailyViews: { increment: 1 },
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
