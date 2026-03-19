"use server";

import {
    validateDeviceSubscription,
    cancelSubscription,
    revokeDevice,
    restoreDevice,
    getDeviceSubscription,
    refreshSubscriptionCache,
} from "@/domains/subscription/service/subscription.service";

import { revalidatePath } from "next/cache";

/**
 * Validate subscription (used in UI or server components)
 */
export async function checkDeviceSubscription(deviceId: string) {
    try {
        return await validateDeviceSubscription(deviceId);
    } catch (error) {
        console.error("checkDeviceSubscription error:", error);
        return { valid: false, reason: "internal_error" };
    }
}

/**
 *  Create or update subscription (purchase / renewal)
 
export async function createOrUpdateSubscription(data: {
  deviceId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  paidAmount: number;
  planType: any;
}) {
  try {
    const sub = await upsertSubscription(data);

    // optional: revalidate UI
    revalidatePath("/user");

    return { success: true, data: sub };
  } catch (error) {
    console.error("createOrUpdateSubscription error:", error);
    return { success: false };
  }
}
*/

/**
 * Cancel subscription (user action)
 */
export async function cancelDeviceSubscription(deviceId: string) {
    try {
        const sub = await cancelSubscription(deviceId);

        revalidatePath("/user");

        return { success: true, data: sub };
    } catch (error) {
        console.error("cancelDeviceSubscription error:", error);
        return { success: false };
    }
}

/**
 * Admin: revoke device instantly
 */
export async function revokeDeviceAccess(deviceId: string) {
    try {
        await revokeDevice(deviceId);

        return { success: true };
    } catch (error) {
        console.error("revokeDeviceAccess error:", error);
        return { success: false };
    }
}

/**
 * Admin: restore revoked device
 */
export async function restoreDeviceAccess(deviceId: string) {
    try {
        await restoreDevice(deviceId);

        return { success: true };
    } catch (error) {
        console.error("restoreDeviceAccess error:", error);
        return { success: false };
    }
}

/**
 * Get subscription details (for UI/dashboard)
 */
export async function getDeviceSubscriptionAction(deviceId: string) {
    try {
        const sub = await getDeviceSubscription(deviceId);
        return { success: true, data: sub };
    } catch (error) {
        console.error("getDeviceSubscriptionAction error:", error);
        return { success: false };
    }
}

/**
 * Force refresh cache (debug/admin)
 */
export async function refreshSubscription(deviceId: string) {
    try {
        const sub = await refreshSubscriptionCache(deviceId);
        return { success: true, data: sub };
    } catch (error) {
        console.error("refreshSubscription error:", error);
        return { success: false };
    }
}