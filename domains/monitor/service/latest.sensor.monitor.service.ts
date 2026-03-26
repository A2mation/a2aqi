import { getLatestSensorReadings, getLatestSensorWithAQIReadings } from "../repo/latest.sensor.monitor.repo"


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

export async function latestsensorReadingWithDeviceDetails(deviceId: string) {
    if (!deviceId) {
        throw new Error("Device ID is required")
    }

    const data = await getLatestSensorWithAQIReadings(deviceId);

     if (!data) {
        throw new Error("Device ID is NOT Found")
    }

    const deviceDetails = {
        id: deviceId,
        name: data.device.name,
        serialNo: data.device.serialNo,
        type: data.device.type,
        status: data.device.status,
        lat: data.device.lat,
        lng: data.device.lng,
        modelName: data.device.model.name,
        aqi: data.aqi
    }

    return deviceDetails;
}