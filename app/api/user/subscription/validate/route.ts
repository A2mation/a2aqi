import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { validateSubscriptionController } from "@/domains/subscription/controller/subscription.controller";
import { userGuard } from "@/lib/userAuth";

const querySchema = z.object({
    deviceId: z.string().min(1, "deviceId is required"),
});

export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { user } = await userGuard()
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }


        // Extract query params
        const rawQuery = {
            deviceId: req.nextUrl.searchParams.get("deviceId"),
        };

        // Validate with Zod
        const parsed = querySchema.safeParse(rawQuery);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid request",
                    details: parsed.error,
                },
                { status: 400 }
            );
        }

        const { deviceId } = parsed.data;

        // Call controller
        const result = await validateSubscriptionController({
            deviceId,
            userId: user.id
        });

        return NextResponse.json(result.body, {
            status: result.status,
        });
    } catch (error) {
        console.error("Subscription validate error:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}