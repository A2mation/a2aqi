import { haversine } from "@/helpers/haversine";
import { NearByCitiesRepository } from "../repo/nearbycities.repo";

export class NearByCitiesService {
    private repoObj = new NearByCitiesRepository();


    /**
   * Fetch nearby AQI data based on coordinates from WAQI
   * 
   * @param lat - Latitude of the location
   * @param lng - Longitude of the location
   * @returns List of location based nearby AQI readings (10 Readings)
   */
    public async nearbyCitiesService(lat: number, lng: number) {
        const latNum = Math.round(Number(lat) * 100) / 100
        const lonNum = Math.round(Number(lng) * 100) / 100

        const radiusKm = 200;
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos((latNum * Math.PI) / 180));

        const candidates = await this.repoObj.nearbyCitiesData(latNum, lonNum, latDelta, lngDelta);

        const nearest10 = candidates
            .map((c) => ({
                ...c,
                distanceKm: haversine(latNum, lonNum, c.lat, c.lng),
            }))
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .filter((item, index, self) => {
                return (
                    index ===
                    self.findIndex(
                        (x) => x.lat === item.lat && x.lng === item.lng
                    )
                )
            })
            .slice(0, 10);
        return nearest10;
    }
}