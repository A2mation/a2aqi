import { DailyDashboardController } from "@/domains/dashboard/controllers/daily.controller";


export async function GET(req: Request) {
    return DailyDashboardController(req);
}
