import { DB, prisma } from "@/lib/prisma";

import { DeviceSubscription } from "../types/type";

export async function createDeviceSubscription(data: DeviceSubscription, tx?: DB) {
    const db = tx || prisma;
    return db.deviceSubscription.create({
        data: {
            userId: data.userId,
            deviceId: data.deviceId,
            startDate: data.startDate,
            endDate: data.endDate,
            status: "ACTIVE",
            paidAmount: data.paidAmount,
            planType: data.planType
        }
    })
}