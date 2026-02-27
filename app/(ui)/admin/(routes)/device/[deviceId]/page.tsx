import { prisma } from "@/lib/prisma";

import { DeviceForm } from "./components/device-form";

const SingleDeviceModelPage = async ({
    params,
}: {
    params: Promise<{ deviceId: string }>
}) => {
    const deviceId = (await params).deviceId;

    if (!deviceId) {
        return null;
    }

    const device = await prisma.device.findFirst({
        where: {
            id: deviceId == 'new' ? '60530408203d565918dc80e7' : deviceId // dummy id for new device model
        },
        select: {
            id: true,
            name: true,
            serialNo: true,
            status: true,
            apiKey: true,
            lat: true,
            lng: true,
            model: {
                select: {
                    id: true,
                    name: true,
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            createdAt: true,
        }
    });

    const formattedDevice = device
        ? {
            id: device.id,
            name: device.name ?? "",
            serialNo: device.serialNo,
            status: device.status,
            apiKey: device.apiKey,
            modelId: device.model.id,
            modelName: device.model.name,
            userId: device.user?.id ?? "",
            username: device.user?.name ?? "",
            email: device.user?.email ?? "",
            lat: device.lat?.toString() ?? "",
            lng: device.lng?.toString() ?? "",
            createdAt: device.createdAt,
        }
        : null;

        // console.log(formattedDevice)

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <DeviceForm initialData={formattedDevice} />
            </div>
        </div>
    )
}

export default SingleDeviceModelPage
