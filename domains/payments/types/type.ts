import { SubscriptionDuration } from "@prisma/client"

export interface DeviceSubscription {
    userId: string,
    deviceId: string,
    startDate: Date,
    endDate: Date,
    paidAmount: number
    planType: SubscriptionDuration
}