export function subscriptionKey(id: string) {
    return `subscription:device:${id}`
}

export function revokeSubscriptionKey(id: string) {
    return `revoked:device:${id}`
}