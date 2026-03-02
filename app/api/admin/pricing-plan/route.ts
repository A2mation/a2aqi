import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export async function GET() {
    try {

        await adminGuard();

        const pricingPlan = await prisma.pricingPlan.findMany();

        return NextResponse.json(pricingPlan);


    } catch (error: any) {
        return handleAdminError(error);
    }
}


export async function POST(request: Request) {
    try {
        await adminGuard();

        const body = await request.json();
        const { modelId, duration, price, currency, isEnabled } = body;

        if (!modelId || !duration || price === undefined || price < 0) {
            return new NextResponse("Model ID, Duration, and Price are required", { status: 400 });
        }

        const existingPlan = await prisma.pricingPlan.findUnique({
            where: {
                modelId_duration: {
                    modelId,
                    duration
                }
            }
        });

        if (existingPlan) {
            return NextResponse.json(
                { message: `A pricing plan for this duration already exists for this model.` },
                { status: 409 }
            );
        }

        const newPricingPlan = await prisma.pricingPlan.create({
            data: {
                modelId,
                duration,
                price: parseFloat(price), // Ensure it's a number
                currency: currency || "INR",
                isEnabled: isEnabled !== undefined ? isEnabled : true,
            },
        });

        return NextResponse.json(newPricingPlan, { status: 201 });

    } catch (error: any) {
        return handleAdminError(error);
    }
}