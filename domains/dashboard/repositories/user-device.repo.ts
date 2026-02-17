import { prisma } from "@/lib/prisma";
import { deviceDefaultSelect } from "../dto/user-device.select.dto";

export class UserDeviceRepo {
    static async findDeviceByuserId(userId: string) {
        return prisma.device.findMany({
            where: { userId: userId },
            select: deviceDefaultSelect
        });
    }
}
