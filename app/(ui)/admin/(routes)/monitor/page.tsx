export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { format } from 'date-fns'

import { prisma } from '@/lib/prisma'
import { MonitorClient } from './components/client'
import { MonitorColumn } from './components/columns';

const MonitorsPage = async () => {
    const monitors = await prisma.monitor.findMany({
        include: {
            _count: {
                select: { devices: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedMonitors: MonitorColumn[] = monitors.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        status: item.status,
        tag: item.tag,
        deviceCount: item._count.devices,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <MonitorClient data={formattedMonitors} />
            </div>
        </section>
    )
}

export default MonitorsPage