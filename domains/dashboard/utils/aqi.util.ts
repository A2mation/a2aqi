export function getAqiLevel(aqi: number | null) {
    if (aqi == null) return null;

    if (aqi <= 50) return "GOOD";
    if (aqi <= 100) return "MODERATE";
    if (aqi <= 200) return "UNHEALTHY";
    if (aqi <= 300) return "VERY_UNHEALTHY";
    return "HAZARDOUS";
}
