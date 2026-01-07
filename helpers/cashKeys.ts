/* -----------------------------------
   Redis key helper (lat/lng based)
----------------------------------- */
export function getLocationCacheKey(lat: number, lng: number) {
    return `location:${lat.toFixed(4)},${lng.toFixed(4)}`
}

export function getNearbyCitiesCacheKey(lat: number, lng: number) {
    return `nearbyCities:${lat.toFixed(4)},${lng.toFixed(4)}`
}