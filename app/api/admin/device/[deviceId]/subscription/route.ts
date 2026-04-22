export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { adminGuard } from "@/lib/adminAuth";
import { handleAdminError } from "@/lib/handleRoleError";
import { DeviceSubscriptionSchema } from "@/lib/validation/AdminDeviceSubscription";
import { withAuditContext } from "@/lib/withAuditContext";
import { cancelSubscription, refreshSubscriptionCache } from "@/domains/subscription/service/subscription.service";
import { DeviceSubscriptionStatus } from "@prisma/client";


export async function POST(
    req: Request,
    params: {
        params: Promise<{ deviceId: string }>
    }) {
    try {

        const { deviceId } = await params.params;

        if (!deviceId) {
            return NextResponse.json({
                message: "Device Not Found",
            }, { status: 404 });
        }

        const { admin } = await adminGuard();

        const body = await req.json();
        const validation = DeviceSubscriptionSchema.safeParse(body);

        if (!validation.success) {
            console.log(validation.error)
            return NextResponse.json({
                message: "Validation Failed",
                errors: validation.error.message
            }, { status: 400 });
        }


        const data = validation.data;



        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            },
            select: {
                id: true
            }
        })

        if (!user) {
            return NextResponse.json({
                message: "User Not Found",
            }, { status: 404 });
        }

        let subscription = {};

        await withAuditContext({
            ip: req.headers.get("x-forwarded-for") || "unknown",
            route: "admin-handle-device-subscription",
            userId: admin.id,
            isAdmin: true,
            role: "ADMIN",
        }, async () => {
            subscription = await prisma.deviceSubscription.upsert({
                where: { deviceId: deviceId },
                update: {
                    status: data.status,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    paidAmount: data.paidAmount,
                    autoRenew: data.autoRenew,
                    adminModified: true,
                    notes: data.notes,
                },
                create: {
                    deviceId: deviceId,
                    userId: user.id,
                    planType: data.planType,
                    status: data.status,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    adminModified: true,
                    paidAmount: data.paidAmount,
                    autoRenew: data.autoRenew,
                    notes: data.notes,
                },
            });

        })

        if (data.status === DeviceSubscriptionStatus.SUSPENDED) {
            await cancelSubscription(deviceId);
        } else {
            await refreshSubscriptionCache(deviceId);
        }


        return NextResponse.json({
            message: "Subscription processed successfully",
            data: subscription
        });

    } catch (error) {
        return handleAdminError(error);
    }
}