import { format } from "date-fns";

import { prisma } from "@/lib/prisma";

import { DeviceClient } from './components/client'
import { Device } from './components/columns'



const DevicePage = async () => {
    const allDevice = await prisma.device.findMany({
        include: {
            model: true,
            user: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const formattedDevices: Device[] = allDevice.map((item) => ({
        id: item.id,
        name: item.name ?? "N/A",
        serialNo: item.serialNo,
        status: item.status,
        model: item.model?.name ?? "N/A",
        user: item.user?.name ?? "Not Assigned",
        assignedAt: item.assignedAt ? format(item.assignedAt, "MMMM do yyyy") : "Not Assigned",
        createdAt: format(item.createdAt, "MMMM do yyyy"),
    }));

    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <DeviceClient data={formattedDevices} />
            </div>
        </section>
    )
}

export default DevicePage
