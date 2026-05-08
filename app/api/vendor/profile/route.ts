import { vendorGuard } from "@/lib/vendorAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { vendor } = await vendorGuard();
        
        return NextResponse.json(vendor, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error", error: true },
            { status: 500 }
        );
    }
}
