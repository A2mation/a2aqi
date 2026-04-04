import { DeviceStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getWeekRange } from "@/domains/dashboard/utils/date-bucket.util";


export class AQIHistoryRepository {

    /**
     * Function to Get our own device Data
     * @param deviceId 
     * @param date 
     * @returns 
     */
    async findLastWeekDataFromInternalSource(deviceId: string, date: string) {

        const {
            start,
            end
        } = getWeekRange(date);

        return prisma.dailyAggregateReading.findMany({
            where: {
                deviceId,
                dayStart: {
                    gte: start,
                    lt: end,
                },
                device: {
                    isActive: true,
                    status: DeviceStatus.ASSIGNED
                }
            },
            orderBy: { dayStart: "asc" },
            select: {
                id: true,
                sumAqi: true,
                sumTemperature: true,
                count: true,
                dayStart: true
            }
        });
    }


    /**
     * Function to Get WAQI data
     * @param lat 
     * @param lng 
     * @returns 
     */
    async findLastWeekDataFromExternalSource(lat: number, lng: number) {
        return prisma.aQIReading.findMany({
            where: {
                lat,
                lng
            },
            take: 7,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                aqi: true,
                temperature: true,
                createdAt: true
            }
        })
    }
}