import React from 'react'
import { prisma } from '@/lib/prisma';
import { WriterForm } from './components/writer-form';


const DynamicWriterPage = async ({
    params,
}: {
    params: Promise<{ writerId: string }>
}) => {

    const writerId = (await params).writerId;

    if (!writerId) {
        return null;
    }

    const writer = await prisma.contentWriter.findFirst({
        where: {
            id: writerId=='new' ? '60530408203d565918dc80e7' :writerId
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            status: true,
        }
    });


    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <WriterForm initialData={writer} />
            </div>
        </div>
    )
}

export default DynamicWriterPage