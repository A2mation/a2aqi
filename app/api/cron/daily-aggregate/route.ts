import { runDailyAggregation } from "@/services/daily-aggregation/dailyAggregation";
import { NextResponse } from "next/server";


const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
    const auth = req.headers.get("authorization");

    if (auth !== `Bearer ${CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    const result = await runDailyAggregation();

    return NextResponse.json({
        success: true,
        // ...result,
    });
}
