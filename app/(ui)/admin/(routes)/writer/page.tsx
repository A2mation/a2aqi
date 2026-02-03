import { format } from 'date-fns'

import { prisma } from '@/lib/prisma'
import { WriterColumn } from './components/columns';
import { WriterClient } from './components/client';

const AdminWriterPage = async () => {
    const writer = await prisma.contentWriter.findMany({
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            status: true,
            createdAt: true,
        }, orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedWriter: WriterColumn[] = writer.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        username: item.username,
        status: item.status,
        createdAt: format(item.createdAt, "MMMM do yyyy")
    }))

    return (
        <>
            <section className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <WriterClient data={formattedWriter} />
                </div>
            </section>
        </>
    )
}

export default AdminWriterPage
