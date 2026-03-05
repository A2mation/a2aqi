import { prisma } from "@/lib/prisma"
import { SubscriptionDuration } from "@prisma/client"

/**
 * Get a single pricing plan
 */
export async function getPricingPlanByDuration(
    modelId: string,
    duration: SubscriptionDuration
) {
    return prisma.pricingPlan.findFirst({
        where: {
            modelId,
            duration,
            isEnabled: true
        }
    })
}

/**
 * Get all plans for a device model
 */
export async function getPricingPlansByModel(modelId: string) {
    return prisma.pricingPlan.findMany({
        where: {
            modelId,
            isEnabled: true
        },
        orderBy: {
            duration: "asc"
        }
    })
}

/**
 * Get pricing plan by id
 */
export async function getPricingPlanById(planId: string) {
    return prisma.pricingPlan.findUnique({
        where: { id: planId }
    })
}