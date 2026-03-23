import { prisma } from "@/lib/prisma";

export async function getMonitorDetailsByMonitorID(monitorId: string) {
    return prisma.monitor.findUnique({
        where: {
            id: monitorId
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            status: true,
            tag: true,
        }
    })
}

export async function getmonitorStatusDetails(monitorId: string) {
    return prisma.monitor.findUnique({
        where: {
            id: monitorId
        },
        select: {
            status: true
        }
    })
}