export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { format } from 'date-fns'

import { prisma } from '@/lib/prisma'
import { ModeratorClient } from './components/client'
import { ModeratorColumn } from './components/columns';

const ModeratorsPage = async () => {
    const moderators = await prisma.admin.findMany({
        where: {
            role: "MODERATOR"
        },
        include: {
            _count: {
                select: { calibrations: true } 
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedModerators: ModeratorColumn[] = moderators.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role,
        calibrationCount: item._count.calibrations,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ModeratorClient data={formattedModerators} />
            </div>
        </section>
    )
}

export default ModeratorsPage