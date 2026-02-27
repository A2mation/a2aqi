import { prisma } from "@/lib/prisma";
import { DeviceStatus } from "@prisma/client";
import { deviceDefaultSelect } from "../dto/user-device.select.dto";

export class DeviceRepo {
    static async findById(deviceId: string) {
        return prisma.device.findUnique({
            where: {
                id: deviceId,
                status: DeviceStatus.ASSIGNED,
                isActive: true,
            },
            select: deviceDefaultSelect
        });
    }

    static async findBySerialNo(serialNo: string) {
        return prisma.device.findUnique({
            where: {
                serialNo,
                status: DeviceStatus.ASSIGNED,
                isActive: true
            },
            select: deviceDefaultSelect
        });
    }
}
