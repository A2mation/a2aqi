import { DashboardOverviewController } from "@/domains/dashboard/controllers/dashboard.controller";


export async function GET(req: Request) {
    return DashboardOverviewController(req);
}
