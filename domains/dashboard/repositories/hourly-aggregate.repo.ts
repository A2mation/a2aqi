import { prisma } from "@/lib/prisma";
import { DeviceStatus } from "@prisma/client";

export class HourlyAggregateRepo {
    static async findByDate(deviceId: string, date: string) {
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);

        return prisma.hourlyAggregateReading.findMany({
            where: {
                deviceId,
                hourStart: {
                    gte: start,
                    lt: end,
                },
                device: {
                    isActive: true,
                    status: DeviceStatus.ASSIGNED
                }
            },
            orderBy: { hourStart: "asc" },
        });
    }
}
