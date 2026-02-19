import { WeeklyDashboardController } from "@/domains/dashboard/controllers/weekly.controller";

export async function GET(req: Request) {
    return WeeklyDashboardController(req);
}
