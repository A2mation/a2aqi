import { NextRequest, NextResponse } from "next/server"

import { LocationController } from "@/domains/public/landing/controller/location.controller";

/* -----------------------------------
   GET handler
----------------------------------- */
export async function GET(req: NextRequest) {
    try {
        const controller = new LocationController();
        return controller.locationController(req);
    } catch (error: any) {
        return NextResponse.json({
            message: "INTERNAL SERVER ERROR",
            success: false
        }, { status: 500 })
    }
}


