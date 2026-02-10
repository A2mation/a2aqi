import { prisma } from "@/lib/prisma";

import { DeviceModelForm } from "./components/device-model-form";

const SingleDeviceModelPage = async ({
    params,
}: {
    params: Promise<{ deviceModelId: string }>
}) => {
    const deviceModelId = (await params).deviceModelId;

    if (!deviceModelId) {
        return null;
    }

    const deviceModel = await prisma.deviceModel.findFirst({
        where: {
            id: deviceModelId == 'new' ? '60530408203d565918dc80e7' : deviceModelId // dummy id for new device model
        },
        select: {
            id: true,
            name: true,
            description: true,
            manufacturer: true,
            isActive: true,
            createdAt: true,
        }
    });

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <DeviceModelForm initialData={deviceModel} />
            </div>
        </div>
    )
}

export default SingleDeviceModelPage
