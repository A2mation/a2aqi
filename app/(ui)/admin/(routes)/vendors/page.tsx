export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { format } from 'date-fns'

import { prisma } from '@/lib/prisma'
import { VendorClient } from './components/client'
import { VendorColumn } from './components/columns';

const VendorsPage = async () => {
    const vendors = await prisma.admin.findMany({
        where: {
            role: "VENDOR"
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedVendors: VendorColumn[] = vendors.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role,
        status: item.status,
        gstNumber: item.gstNumber,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <VendorClient data={formattedVendors} />
            </div>
        </section>
    )
}

export default VendorsPage