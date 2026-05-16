import { authenticateSensor } from "@/domains/sensors/sensor.auth";
import { SensorError } from "@/domains/sensors/sensor.error";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const apiKey = req.headers.get("x-api-key");
        const serialNo = req.headers.get("x-serialNo");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key" },
                { status: 401 }
            );
        }
        if (!serialNo) {
            return NextResponse.json(
                { error: "Missing Serial No" },
                { status: 401 }
            );
        }

        const device = await authenticateSensor(serialNo, apiKey);

        const { searchParams } = new URL(req.url);
        const flagParam = searchParams.get("flag");
        const pageParam = searchParams.get("page");

        if (!flagParam) {
            return NextResponse.json(
                { error: 'No flag given' },
                { status: 400 }
            );
        }

        // Convert parameters to numbers
        const flag = Number(flagParam);
        const page = pageParam ? Number(pageParam) : null;

        // Condition 1: flag is 1
        if (flag === 1) {
            return NextResponse.json(
                { flag: 'Success! Here you get the flag' },
                { status: 200 }
            );
        }

        // Condition 2: flag is 0 AND page is between 1 and 14 (inclusive)
        if (flag === 0 && page !== null && page >= 1 && page <= 14) {
            return NextResponse.json(
                { message: `Success! You requested page ${page} with flag 0.` },
                { status: 200 }
            );
        }

        // Fallback if the query params don't match expected criteria
        return NextResponse.json(
            { error: "Invalid flag or page range combination" },
            { status: 400 }
        );

    } catch (err: any) {
        if (err instanceof SensorError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.statusCode }
            );
        }
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}