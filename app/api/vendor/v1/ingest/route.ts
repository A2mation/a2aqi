import { SensorError } from "@/domains/sensors/sensor.error";
import { validateSensorPayload } from "@/domains/sensors/sensor.validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = req.headers.get("x-api-key");

        if (!apiKey) {
            console.log('MIssing')

            return NextResponse.json(
                { error: "Missing API key" },
                { status: 401 }
            );
        }

        const body = await req.json();

        // Validate payload
        const payload = validateSensorPayload(body);

    } catch (err: any) {
        if (err instanceof SensorError) {
            return NextResponse.json(
                { error: err.message },
                { status: err.statusCode }
            );
        }

        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}