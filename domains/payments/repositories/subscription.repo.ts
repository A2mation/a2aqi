import { Payment, SubscriptionDuration } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DeviceSubscription } from "../types/type";

export async function createDeviceSubscription(data: DeviceSubscription) {
    return prisma.deviceSubscription.create({
        data: {
            userId: data.userId,
            deviceId: data.deviceId,
            startDate: data.startDate,
            endDate: data.endDate,
            paidAmount: data.paidAmount,
            planType: data.planType
        }
    })
}