import { HourlyDashboardController } from "@/domains/dashboard/controllers/hourly.controller";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        return HourlyDashboardController(req);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
