import { HourlyTimeSlotController } from "@/domains/dashboard/controllers/hourly-time-slot.controller";
import { NextRequest } from "next/server";


const controller = new HourlyTimeSlotController();

export async function GET(req: NextRequest) {
    return controller.getHourlyHeatmap(req);
}
