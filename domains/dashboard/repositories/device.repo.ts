import { prisma } from "@/lib/prisma";

export class DeviceRepo {
    static async findById(deviceId: string) {
        return prisma.device.findUnique({
            where: { id: deviceId },
        });
    }

    static async findBySerialNo(serialNo: string) {
        return prisma.device.findUnique({
            where: { serialNo },
        });
    }
}
