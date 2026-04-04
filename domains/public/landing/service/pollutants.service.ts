import { transformInternalForNearbyLocationsData } from "@/helpers/transformInternalData";
import { PollutantsRepository } from "../repo/pollutant.repo";
import { AQIReading } from "@prisma/client";
import { haversine } from "@/helpers/haversine";

export class PollutantServices {
    private radiusKm = 200;
    private pollutantRepoObj = new PollutantsRepository();

    public async getNearestLocationData(lat: number, lng: number) {
        const latDelta = this.radiusKm / 111
        const lngDelta = this.radiusKm / (111 * Math.cos((lat * Math.PI) / 180))


        const candidates = await this.pollutantRepoObj.getNearbyCandidates(lat, lng, latDelta, lngDelta);

        const c = await this.pollutantRepoObj.getNearbyLatestReadings(lat, lng, latDelta, lngDelta);


        const sensorData = transformInternalForNearbyLocationsData(c, candidates[0].state);

        const allReadings = [...candidates, ...sensorData];

        const nearest = allReadings.reduce((best, curr) => {
            const dist = haversine(lat, lng, curr.lat, curr.lng)

            if (!best || dist < best.dist) return { curr, dist }
            return best
        }, null as null | { curr: AQIReading; dist: number })

        return nearest;
    }


}