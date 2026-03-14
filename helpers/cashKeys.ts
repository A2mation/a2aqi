/* -----------------------------------
   Redis key helper (lat/lng based)
----------------------------------- */
export function getLocationCacheKey(lat: number, lng: number) {
    return `location:${lat.toFixed(4)},${lng.toFixed(4)}` // 4 Decimal Places: Accuracy is roughly 11 meters.
}

export function getNearbyCitiesCacheKey(lat: number, lng: number) {
    return `nearbyCities:${lat.toFixed(2)},${lng.toFixed(2)}`
}

export function getDeviceKey(id: string) {
    return `ratelimit:device:${id}`;
}