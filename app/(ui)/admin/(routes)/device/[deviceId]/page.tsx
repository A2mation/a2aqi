import { prisma } from "@/lib/prisma";

import { DeviceForm } from "./components/device-form";

const SingleDeviceModelPage = async ({
    params,
}: {
    params: Promise<{ deviceId: string }>
}) => {
    const deviceModelId = (await params).deviceId;

    if (!deviceModelId) {
        return null;
    }

    const device = await prisma.device.findFirst({
        where: {
            id: deviceModelId == 'new' ? '60530408203d565918dc80e7' : deviceModelId // dummy id for new device model
        },
        select: {
            id: true,
            name: true,
            serialNo: true,
            status: true,
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
                    name: true
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
            modelId: device.model.id,
            modelName: device.model.name,
            user: device.user?.name ?? "",
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
