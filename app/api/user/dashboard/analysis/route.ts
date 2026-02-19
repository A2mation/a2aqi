import { NextRequest } from "next/server";
import { QuarterlyDashboardController } from "@/domains/dashboard/controllers/quarterly.controller";

export async function GET(req: NextRequest) {
    return QuarterlyDashboardController(req);
}
