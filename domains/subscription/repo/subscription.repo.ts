import { prisma } from "@/lib/prisma";
import { DeviceSubscriptionStatus } from "@prisma/client";

/**
 * Get subscription by deviceId
 */
export async function getByDeviceId(deviceId: string) {
    return prisma.deviceSubscription.findUnique({
        where: { deviceId },
    });
}

/**
 * Get subscription by userId (all devices)
 */
export async function getByUserId(userId: string) {
    return prisma.deviceSubscription.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Get active subscription for a device
 */
export async function getActiveByDevice(deviceId: string) {
    return prisma.deviceSubscription.findFirst({
        where: {
            deviceId,
            status: DeviceSubscriptionStatus.ACTIVE,
            endDate: {
                gt: new Date(),
            },
        },
    });
}

/**
 * Check if device has valid subscription
 */
export async function isDeviceSubscribed(deviceId: string) {
    const sub = await getActiveByDevice(deviceId);
    return !!sub;
}

/**
 * Get expired subscriptions
 */
export async function getExpiredSubscriptions() {
    return prisma.deviceSubscription.findMany({
        where: {
            endDate: {
                lt: new Date(),
            },
            status: DeviceSubscriptionStatus.ACTIVE,
        },
    });
}

/**
 * Mark subscription as expired
 */
export async function markAsExpired(id: string) {
    return prisma.deviceSubscription.update({
        where: { id },
        data: {
            status: DeviceSubscriptionStatus.EXPIRED,
        },
    });
}

/**
 * Bulk expire subscriptions (cron job)
 */
export async function expireSubscriptionsBatch() {
    return prisma.deviceSubscription.updateMany({
        where: {
            endDate: {
                lt: new Date(),
            },
            status: DeviceSubscriptionStatus.ACTIVE,
        },
        data: {
            status: DeviceSubscriptionStatus.EXPIRED,
        },
    });
}

/**
 * Cancel subscription manually (user/admin)
 */
export async function cancelSubscription(deviceId: string) {
    return prisma.deviceSubscription.update({
        where: { deviceId },
        data: {
            status: DeviceSubscriptionStatus.SUSPENDED,
            autoRenew: false,
        },
    });
}

/**
 * Admin override (extend / modify)
 */
export async function adminUpdateSubscription({
    deviceId,
    endDate,
    notes,
}: {
    deviceId: string;
    endDate: Date;
    notes?: string;
}) {
    return prisma.deviceSubscription.update({
        where: { deviceId },
        data: {
            endDate,
            adminModified: true,
            notes,
            status: DeviceSubscriptionStatus.ACTIVE,
        },
    });
}

/**
 * Toggle auto-renew
 */
export async function toggleAutoRenew(
    deviceId: string,
    autoRenew: boolean
) {
    return prisma.deviceSubscription.update({
        where: { deviceId },
        data: { autoRenew },
    });
}

/**
 * Get subscriptions expiring soon (for notifications)
 */
export async function getExpiringSoon(days = 3) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.deviceSubscription.findMany({
        where: {
            endDate: {
                lte: futureDate,
                gt: new Date(),
            },
            status: DeviceSubscriptionStatus.ACTIVE,
        },
    });
}

/**
 * Delete subscription (rare, admin/debug)
 */
export async function deleteByDevice(deviceId: string) {
    return prisma.deviceSubscription.delete({
        where: { deviceId },
    });
}

/**
 * Add ownership validation
 */
export async function getDeviceOwner(deviceId: string) {
  return prisma.deviceSubscription.findUnique({
    where: { deviceId },
    select: { userId: true },
  });
}