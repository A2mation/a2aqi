import { LiveDashboardController } from "@/domains/dashboard/controllers/live.controller";

export async function GET(req: Request) {
    return LiveDashboardController(req);
}

