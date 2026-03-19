import { DeviceSubscription, DeviceSubscriptionStatus } from "@prisma/client";

import { redis } from "@/lib/redis";
import * as repo from "@/domains/subscription/repo/subscription.repo";
import { revokeSubscriptionKey, subscriptionKey } from "@/constant/SubscriptionKey";
import { SubscriptionValidationResult } from "@/types/subscription";


/**
 * Get subscription (Hybrid: Redis → DB)
 */
export async function getDeviceSubscription(deviceId: string) {
    const cacheKey = subscriptionKey(deviceId);

    // Check Redis
    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    // DB fallback
    const sub = await repo.getByDeviceId(deviceId);
    if (!sub) return null;

    // Cache with TTL (until expiry)
    const ttl = Math.floor(
        (new Date(sub.endDate).getTime() - Date.now()) / 1000
    );

    if (ttl > 0) {
        await redis.set(cacheKey, JSON.stringify(sub), "EX", ttl);
    }

    return sub;
}

/**
 * Validate device subscription (MAIN FUNCTION)
 */
export async function validateDeviceSubscription(deviceId: string) {
    //  Check revocation (instant control)
    const revoked = await redis.get(revokeSubscriptionKey(deviceId));
    if (revoked) {
        return {
            valid: false,
            reason: "revoked",
            source: "redis",
        } as const;;
    }

    //  Fast path (cache)
    const cached = await redis.get(subscriptionKey(deviceId));
    if (cached) {
        const sub = JSON.parse(cached);

        if (isSubscriptionValid(sub)) {
            return {
                valid: true,
                source: "cache",
                data: sub,
            } as const;;
        }
    }

    //  DB fallback
    const sub = await repo.getByDeviceId(deviceId);

    if (!sub) {
        return { valid: false, reason: "not_found" } as const;;
    }

    //  Check validity
    if (!isSubscriptionValid(sub)) {
        return { valid: false, reason: "expired_or_inactive" } as const;;
    }

    // Cache it again
    await cacheSubscription(sub);

    return {
        valid: true,
        source: "db",
        data: sub,
    } as const;;
}

/**
 * Core validity logic
 */
function isSubscriptionValid(sub: DeviceSubscription) {
    if (!sub) return false;

    if (sub.status !== DeviceSubscriptionStatus.ACTIVE) {
        return false;
    }

    if (new Date(sub.endDate) < new Date()) {
        return false;
    }

    return true;
}

/**
 * Cache subscription with TTL
 */
async function cacheSubscription(sub: DeviceSubscription) {
    const ttl = Math.floor(
        (new Date(sub.endDate).getTime() - Date.now()) / 1000
    );

    if (ttl > 0) {
        await redis.set(
            subscriptionKey(sub.deviceId),
            JSON.stringify(sub),
            "EX",
            ttl
        );
    }
}

/**
 * Create / Update subscription
 */
// export async function upsertSubscription(data: {
//     deviceId: string;
//     userId: string;
//     startDate: Date;
//     endDate: Date;
//     paidAmount: number;
//     planType: any;
// }) {
//     const sub = await repo.upsertDeviceSubscription(data);

//     // 🧹 Invalidate cache
//     await redis.del(subscriptionKey(data.deviceId));

//     return sub;
// }

/**
 * Cancel subscription
 */
export async function cancelSubscription(deviceId: string) {
    const sub = await repo.cancelSubscription(deviceId);

    //  Revoke immediately
    await redis.set(revokeSubscriptionKey(deviceId), "true");

    //  Remove cache
    await redis.del(subscriptionKey(deviceId));

    return sub;
}

/**
 *  Revoke access manually (admin/security)
 */
export async function revokeDevice(deviceId: string) {
    await redis.set(revokeSubscriptionKey(deviceId), "true");
}

/**
 *  Restore access (remove revoke)
 */
export async function restoreDevice(deviceId: string) {
    await redis.del(revokeSubscriptionKey(deviceId));
}

/**
 *  Refresh cache manually
 */
export async function refreshSubscriptionCache(deviceId: string) {
    const sub = await repo.getByDeviceId(deviceId);

    if (!sub) return null;

    await cacheSubscription(sub);

    return sub;
}

/**
 *  Handle expired subscriptions (cron-safe)
 */
export async function handleExpiredSubscriptions() {
    const expired = await repo.getExpiredSubscriptions();

    for (const sub of expired) {
        await repo.markAsExpired(sub.id);

        // 🧹 clear cache
        await redis.del(subscriptionKey(sub.deviceId));
    }

    return expired.length;
}

/**
 * Get expiring soon (for notifications)
 */
export async function getExpiringSoon(days = 3) {
    return repo.getExpiringSoon(days);
}


export async function validateDeviceSubscriptionWithOwnership({
    deviceId,
    userId,
}: {
    deviceId: string;
    userId: string;
}): Promise<SubscriptionValidationResult> {
    // Ownership check
    const owner = await repo.getDeviceOwner(deviceId);

    if (!owner) {
        return { valid: false, reason: "not_found" };
    }

    if (owner.userId !== userId) {
        return {
            valid: false,
            reason: "forbidden",
        };
    }

    // Continue existing validation
    return validateDeviceSubscription(deviceId);
}