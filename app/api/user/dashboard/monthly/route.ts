import { MonthlyDashboardController } from "@/domains/dashboard/controllers/monthly.controller";

export async function GET(req: Request) {
    return MonthlyDashboardController(req);
}
