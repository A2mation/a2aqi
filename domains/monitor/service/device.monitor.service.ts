
import {
    getDeviceById,
    getDevices,
    getDevicesByDeviceId,
    getDevicesByMonitorId,
    getDevicesByMonitorIdWithLatestAQIReading,
    getDeviceWithDetails
} from "../repo/device.monitor.repo"



// Service: Get devices assigned to a monitor
export async function getDevicesByMonitor(monitorId: string) {
    if (!monitorId) {
        throw new Error("Monitor ID is required")
    }

    const devices = await getDevicesByMonitorId(monitorId)

    return devices
}

// Service: Get devices assigned to a monitor With Sensor Readings
export async function getDevicesByMonitorWithLatestAQIReadings(
    monitorId: string,
    search: string,
    limit: number,
    skip: number
) {
    if (!monitorId) {
        throw new Error("Monitor ID is required")
    }

    const { devices, totalCount } = await getDevicesByMonitorIdWithLatestAQIReading(monitorId, search, limit, skip)

    const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
    const now = new Date().getTime();

    const formattedDevices = devices.map((device) => {
        const lastUpdate = device.latestSensorReadings?.updatedAt;

        const isActive = lastUpdate
            ? (now - new Date(lastUpdate).getTime()) < TWO_MINUTES_IN_MS
            : false;

        return {
            devices: {
                id: device.id,
                name: device.name,
                serialNo: device.serialNo,
                isActive,
                type: device.type,
                location: device.loaction,
                lat: device.lat,
                lng: device.lng,
                status: device.status,
                aqi: device.latestSensorReadings?.aqi ?? 0,
                createdAt: device.createdAt,
            },
        };
    });

    return {
        formattedDevices,
        totalCount
    }
}

// Service: Get devices assigned to a device
export async function getSingleDeviceDetails(deviceId: string) {
    if (!deviceId) {
        throw new Error("Device ID is required")
    }

    const devices = await getDevicesByDeviceId(deviceId)

    return devices
}

// Service: Get single device by ID
export async function getDevice(deviceId: string) {
    if (!deviceId) {
        throw new Error("Device ID is required")
    }

    const device = await getDeviceById(deviceId)

    if (!device) {
        throw new Error("Device not found or not assigned")
    }

    return device
}

// Service: Get device with full details
export async function getDeviceDetails(deviceId: string) {
    if (!deviceId) {
        throw new Error("Device ID is required")
    }

    const device = await getDeviceWithDetails(deviceId)

    if (!device) {
        throw new Error("Device not found or not assigned")
    }

    return device
}

// Service: Get all devices with filters
export async function getAllDevices(filters?: {
    isActive?: boolean
    search?: string
}) {
    const devices = await getDevices(filters)

    return devices
}