import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";

export async function GET(
    req: Request,
    params: {
        params: Promise<{ pricingPlanId: string }>
    }) {
    try {
        await adminGuard();

        const { pricingPlanId } = await params.params;

        if (!pricingPlanId) {
            return new NextResponse("Pricing Plan ID not Found", {
                status: 400
            })
        }

        const pricingPlan = await prisma.deviceModel.findUnique({
            where: {
                id: pricingPlanId
            }
        })

        if (!pricingPlan) {
            return new NextResponse("Pricing Plan not found", { status: 404 });
        }

        return NextResponse.json(pricingPlan);

    } catch (err: any) {
        return handleAdminError(err);
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ pricingPlanId: string }> } 
): Promise<NextResponse> {
    try {
        await adminGuard();

        const { pricingPlanId } = await params;

        if (!pricingPlanId) {
            return new NextResponse("Pricing Plan ID not found", { status: 400 });
        }

        const body = await req.json();
        const { price, currency, isEnabled } = body;
        
        if (price !== undefined && price < 0) {
            return new NextResponse("Price cannot be negative", { status: 400 });
        }

        const updatedPricingPlan = await prisma.pricingPlan.update({
            where: {
                id: pricingPlanId
            },
            data: {
                
                price: price !== undefined ? parseFloat(price) : undefined,
                currency,
                isEnabled
            }
        });

        return NextResponse.json(updatedPricingPlan);

    } catch (err: any) {
        return handleAdminError(err);
    }
}

export async function DELETE(
    req: Request,
    params: {
        params: Promise<{ pricingPlanId: string }>
    }
) {
    try {

        await adminGuard();

        const { pricingPlanId } = await params.params;
        if (!pricingPlanId) {
            return new NextResponse("Pricing Plan Id not Found", {
                status: 400
            })
        }

        const res = await prisma.pricingPlan.delete({
            where: {
                id: pricingPlanId
            }
        })

        if (!res) {
            return new NextResponse("Pricing Plan not found", { status: 404 });
        }

        return new NextResponse("Pricing Plan deleted successfully", { status: 200 });
    } catch (err: any) {
        return handleAdminError(err);
    }
}