import { prisma } from "@/lib/prisma"
import { DeviceStatus } from "@prisma/client"

// Monitor can see only the assigned devices.
export async function getDevicesByMonitorId(monitorId: string) {
    const result = await prisma.monitorDevice.findMany({
        where: {
            monitorId,
            device: {
                status: DeviceStatus.ASSIGNED
            }
        },
        select: {
            device: {
                select: {
                    id: true,
                    name: true,
                    serialNo: true,
                    status: true,
                    lat: true,
                    lng: true
                }
            }
        }
    })

    return result.map(item => item.device)
}

// Monitor can see only the assigned devices.
export async function getDevicesByMonitorIdWithLatestAQIReading(
    monitorId: string,
    search: string,
    limit: number,
    skip: number
) {
    const whereCondition = {
        monitorId,
        device: {
            status: DeviceStatus.ASSIGNED,
            OR: [
                { serialNo: { contains: search, mode: 'insensitive' as const } },
                { name: { contains: search, mode: 'insensitive' as const } },
            ],
        },
    };

    const [result, totalCount] = await Promise.all([
        prisma.monitorDevice.findMany({
            where: whereCondition,
            select: {
                device: {
                    select: {
                        id: true,
                        name: true,
                        serialNo: true,
                        type: true,
                        status: true,
                        lat: true,
                        lng: true,
                        loaction: true,
                        latestSensorReadings: {
                            select: {
                                aqi: true,
                                updatedAt: true
                            }
                        },
                        createdAt: true
                    }
                }
            },
            skip,
            take: limit,
        }),
        prisma.monitorDevice.count({ where: whereCondition })
    ]);

    return {
        devices: result.map(item => item.device),
        totalCount
    }
}

// 
export async function getDevicesByDeviceId(deviceId: string) {
    const result = await prisma.device.findUnique({
        where: {
            id: deviceId,

            status: DeviceStatus.ASSIGNED

        },
        select: {
            id: true,
            name: true,
            serialNo: true,
            status: true,
            lat: true,
            lng: true
        }
    })

    return result;
}

export async function getDeviceById(deviceId: string) {
    return prisma.device.findUnique({
        where: {
            id: deviceId,
            status: DeviceStatus.ASSIGNED
        }
    })
}

export async function getDeviceWithDetails(deviceId: string) {
    return prisma.device.findUnique({
        where: {
            id: deviceId,
            status: DeviceStatus.ASSIGNED
        },
        include: {
            model: true,
            monitors: {
                include: {
                    monitor: true
                }
            },
            latestSensorReadings: true
        }
    })
}

export async function getDevices(filters?: {
    isActive?: boolean
    search?: string
}) {
    return prisma.device.findMany({
        where: {
            status: DeviceStatus.ASSIGNED,
            isActive: filters?.isActive,
            OR: filters?.search
                ? [
                    { name: { contains: filters.search, mode: "insensitive" } },
                    { serialNo: { contains: filters.search, mode: "insensitive" } }
                ]
                : undefined
        }
    })
}