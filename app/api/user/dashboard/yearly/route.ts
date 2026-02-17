import { YearlyDashboardController } from "@/domains/dashboard/controllers/yearly.controller";

export async function GET(req: Request) {
    return YearlyDashboardController(req);
}
