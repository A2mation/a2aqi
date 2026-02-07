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
            model: {
                select: {
                    name: true,
                }
            },
            createdAt: true,
        }
    });

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <DeviceForm initialData={device} />
            </div>
        </div>
    )
}

export default SingleDeviceModelPage
