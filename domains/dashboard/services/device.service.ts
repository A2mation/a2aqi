import { DeviceRepo } from "../repositories/device.repo";

export class DeviceService {
    static async getDeviceInfo(deviceId: string | null, serialNo: string | null) {
        if (!deviceId && !serialNo) {
            throw new Error("deviceId or serialNo is required");
        }

        const device = deviceId
            ? await DeviceRepo.findById(deviceId)
            : await DeviceRepo.findBySerialNo(serialNo as string);

        if (!device) return null;

        return {
            id: device.id,
            name: device.name ?? null,
            serialNo: device.serialNo,
            isActive: device.isActive,
            status: device.status,
            apiKey: device.apiKey,
            lat: device.lat ?? null,
            lng: device.lng ?? null,
            assignedAt: device.assignedAt ?? null,
            createdAt: device.createdAt,
            updatedAt: device.updatedAt,
        };
    }
}
