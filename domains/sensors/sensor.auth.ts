import { prisma } from "@/lib/prisma";

export async function authenticateSensor(serialNo: string, apiKey: string) {
    const device = await prisma.device.findUnique({
        where: { serialNo: serialNo },
    });
    console.log(device)

    if (!device) throw new Error("Device not found");
    if (!device.isActive) throw new Error("Device is disabled");
    if (device.apiKey !== apiKey) throw new Error("Invalid API key");

    return device;
}
