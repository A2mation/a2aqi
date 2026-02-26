import { prisma } from "@/lib/prisma";
import { SensorError } from "./sensor.error";

export async function authenticateSensor(serialNo: string, apiKey: string) {
    // console.time("db");
    const device = await prisma.device.findUnique({
        where: { serialNo: serialNo },
    });
    // console.timeEnd("db");
    // console.log(device)

    if (!device) throw new SensorError("Device not found", 404);
    if (!device.isActive) throw new SensorError("Device is disabled", 403);
    if (device.apiKey !== apiKey) throw new SensorError("Invalid API key", 401);

    return device;
}
