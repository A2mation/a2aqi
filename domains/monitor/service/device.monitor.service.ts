
import { DeviceStatus } from "@prisma/client"
import { getDeviceById, getDevices, getDevicesByDeviceId, getDevicesByMonitorId, getDeviceWithDetails } from "../repo/device.monitor.repo"

// Service: Get devices assigned to a monitor
export async function getDevicesByMonitor(monitorId: string) {
    if (!monitorId) {
        throw new Error("Monitor ID is required")
    }

    const devices = await getDevicesByMonitorId(monitorId)

    return devices
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