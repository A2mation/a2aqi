import { prisma } from "@/lib/prisma";

export async function getLatestSensorReadings(deviceId: string) {
    return prisma.latestSensorReading.findUnique({
        where :{
            deviceId
        }
    })
}


export async function getLatestSensorWithAQIReadings(deviceId: string) {
    return prisma.latestSensorReading.findUnique({
        where :{
            deviceId
        },
        select: {
            aqi: true,
            device: {
                select: {
                    name: true,
                    serialNo: true,
                    type: true,
                    status: true,
                    lat: true,
                    lng: true,
                    model: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })
}