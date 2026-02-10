import { format } from 'date-fns'

import { prisma } from '@/lib/prisma'
import { DeviceModelClient } from './components/client'
import { DeviceModelColumn } from './components/columns';


const DeviceModelPage = async () => {

    const allDeviceModel = await prisma.deviceModel.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedDeviceModel: DeviceModelColumn[] = allDeviceModel.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        manufacturer: item.manufacturer,
        isActive: item.isActive,
        createdAt: format(item.createdAt, "MMMM do yyyy")
    }))

    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <DeviceModelClient data={formattedDeviceModel} />
            </div>
        </section>
    )
}

export default DeviceModelPage
