export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { format } from 'date-fns'

import { prisma } from '@/lib/prisma'
import { UserClient } from './components/client'
import { UserColumn } from './components/columns';

const VendorUserListingPage = async ({
  params,
}: {
  params: Promise<{ vendorId: string }>
}) => {
  const vendorId = (await params).vendorId;


  const users = await prisma.user.findMany({
    where: {
      creatorId: vendorId
    },
    select: {
      id: true,
      name: true,
      email: true,
      accountType: true,
      status: true,
      createdAt: true,
      _count: {
        select: { devices: true }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const formattedUsers: UserColumn[] = users.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    accountType: item.accountType,
    status: item.status,
    deviceCount: item._count.devices,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <section className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <UserClient data={formattedUsers} />
      </div>
    </section>
  )
}

export default VendorUserListingPage