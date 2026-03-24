import { getLatestSensorReadings } from "../repo/latest.sensor.monitor.repo"


// Service: Get latest sensor readings for a device
export async function getLatestSensorData(deviceId: string) {
    if (!deviceId) {
        throw new Error("Device ID is required")
    }

    const sensorData = await getLatestSensorReadings(deviceId)

    if (!sensorData) {
        throw new Error("No sensor data found for this device")
    }

    return sensorData
}