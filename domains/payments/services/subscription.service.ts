import { Payment, SubscriptionDuration } from "@prisma/client"

import { createDeviceSubscription } from "../repositories/subscription.repo"
import { getPricingPlanById } from "../repositories/pricing-plan.repo"

const durationToMonths: Record<SubscriptionDuration, number> = {
    THREE_MONTHS: 3,
    SIX_MONTHS: 6,
    TWELVE_MONTHS: 12
}

export async function activateSubscription(
    data: Payment
) {

    const plan = await getPricingPlanById(data.pricingPlanId)

    if (!plan) {
        throw new Error("Pricing plan not found")
    }

    const start = new Date();

    const months = durationToMonths[plan.duration]

    const end = new Date(start)
    end.setMonth(start.getMonth() + months)

    return createDeviceSubscription({
        userId: data.userId,
        deviceId: data.deviceId,
        startDate: start,
        endDate: end,
        paidAmount: plan.price,
        planType: plan.duration
    })
}