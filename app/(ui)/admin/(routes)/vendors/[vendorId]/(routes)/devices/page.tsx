export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

import { DeviceClient } from './components/client'
import { Device } from './components/columns'


const VendorDeviceListingPage = async ({
  params,
}: {
  params: Promise<{ vendorId: string }>
}) => {
  const vendorId = (await params).vendorId;

  const allDevice = await prisma.device.findMany({
    where: {
      createdById: vendorId
    },
    select: {
      id: true,
      name: true,
      serialNo: true,
      state: true,
      status: true,
      model: {
        select: {
          name: true
        }
      },
      user: {
        select: {
          name: true,
        }
      },
      assignedAt: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedDevices: Device[] = allDevice.map((item) => ({
    id: item.id,
    name: item.name ?? "N/A",
    serialNo: item.serialNo,
    state: item.state,
    status: item.status,
    model: item.model?.name ?? "N/A",
    user: item.user?.name ?? "Not Assigned",
    assignedAt: item.assignedAt ? item.assignedAt : null,
    createdAt: item.createdAt,
  }));

  return (
    <section className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <DeviceClient data={formattedDevices} />
      </div>
    </section>
  )
}

export default VendorDeviceListingPage
