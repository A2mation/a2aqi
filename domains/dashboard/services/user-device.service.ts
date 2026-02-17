import { UserDeviceRepo } from "../repositories/user-device.repo";

export class UserDeviceService {
    static async getUserDevices(userId: string) {
        if (!userId) {
            throw new Error("userId is required");
        }

        const devices = await UserDeviceRepo.findDeviceByuserId(userId);

        return devices.map((device) => ({
            id: device.id,
            name: device.name ?? null,
            serialNo: device.serialNo,
            isActive: device.isActive,
            status: device.status,
            lat: device.lat ?? null,
            lng: device.lng ?? null,
            assignedAt: device.assignedAt ?? null,
            createdAt: device.createdAt,
            updatedAt: device.updatedAt,
            model: {
                id: device.model.id,
                name: device.model.name,
                manufacturer: device.model.manufacturer
            }
        }));
    }
}
