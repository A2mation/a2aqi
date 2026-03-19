import {
    validateDeviceSubscription,
    cancelSubscription,
    revokeDevice,
    restoreDevice,
    getDeviceSubscription,
    validateDeviceSubscriptionWithOwnership,
} from "@/domains/subscription/service/subscription.service";

/**
 * Validate subscription (main endpoint)
 */
export async function validateSubscriptionController({
    deviceId,
    userId,
}: {
    deviceId: string;
    userId: string;
}) {
    if (!deviceId || !userId) {
        return { status: 400, body: { error: "Missing fields" } };
    }

    const result = await validateDeviceSubscriptionWithOwnership({
        deviceId,
        userId,
    });

    if (!result.valid) {
        const status =
            result.reason === "forbidden" ? 403 : 404;

        return {
            status,
            body: { error: result.reason },
        };
    }

    return {
        status: 200,
        body: {
            success: true,
            source: result.source,
            data: result.data,
        },
    };
}

/**
 * Create / update subscription

export async function createSubscriptionController(payload: {
  deviceId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  paidAmount: number;
  planType: any;
}) {
  const {
    deviceId,
    userId,
    startDate,
    endDate,
    paidAmount,
    planType,
  } = payload;

  if (!deviceId || !userId) {
    return { status: 400, body: { error: "Missing fields" } };
  }

  const sub = await upsertSubscription({
    deviceId,
    userId,
    startDate,
    endDate,
    paidAmount,
    planType,
  });

  return {
    status: 200,
    body: { success: true, data: sub },
  };
}
 */


/**
 * Cancel subscription
 */
export async function cancelSubscriptionController({
    deviceId,
}: {
    deviceId: string;
}) {
    if (!deviceId) {
        return { status: 400, body: { error: "deviceId required" } };
    }

    const sub = await cancelSubscription(deviceId);

    return {
        status: 200,
        body: { success: true, data: sub },
    };
}

/**
 * Revoke device (admin)
 */
export async function revokeDeviceController({
    deviceId,
}: {
    deviceId: string;
}) {
    if (!deviceId) {
        return { status: 400, body: { error: "deviceId required" } };
    }

    await revokeDevice(deviceId);

    return {
        status: 200,
        body: { success: true },
    };
}

/**
 * Restore device (admin)
 */
export async function restoreDeviceController({
    deviceId,
}: {
    deviceId: string;
}) {
    if (!deviceId) {
        return { status: 400, body: { error: "deviceId required" } };
    }

    await restoreDevice(deviceId);

    return {
        status: 200,
        body: { success: true },
    };
}

/**
 * Get subscription details
 */
export async function getSubscriptionController({
    deviceId,
}: {
    deviceId: string;
}) {
    if (!deviceId) {
        return { status: 400, body: { error: "deviceId required" } };
    }

    const sub = await getDeviceSubscription(deviceId);

    if (!sub) {
        return { status: 404, body: { error: "Not found" } };
    }

    return {
        status: 200,
        body: { success: true, data: sub },
    };
}


