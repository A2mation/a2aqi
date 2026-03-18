import { prisma } from "@/lib/prisma";

import { DeviceForm } from "./components/device-form";
import { DeviceSubscription } from "./components/device-subscription-form";
import { DeviceSubscriptionStatus } from "@prisma/client";
import { DeleteDeviceSection } from "./components/reset-button";
import { DeviceSubscriptionTable } from "./components/device-subscription-table";
import { Badge } from "@/components/ui/badge";

const SingleDeviceModelPage = async ({
    params,
}: {
    params: Promise<{ deviceId: string }>
}) => {
    const deviceId = (await params).deviceId;

    const device = deviceId === 'new'
        ? null
        : await prisma.device.findFirst({
            where: {
                id: deviceId
            },
            select: {
                id: true,
                name: true,
                serialNo: true,
                status: true,
                apiKey: true,
                lat: true,
                lng: true,
                assignedAt: true,
                model: {
                    select: {
                        id: true,
                        name: true,
                        pricingPlans: {
                            select: {
                                id: true,
                                duration: true,
                                price: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                createdAt: true,
            }
        });

    const deviceSubscripion = deviceId === 'new'
        ? null
        : await prisma.deviceSubscription.findFirst({
            where: {
                deviceId: deviceId,
                status: DeviceSubscriptionStatus.ACTIVE
            }, select: {
                id: true,
                planType: true,
                paidAmount: true,
                autoRenew: true,
                adminModified: true,
                startDate: true,
                endDate: true,
                status: true,
                notes: true
            },
        })


    const formattedDevice = device
        ? {
            id: device.id,
            name: device.name ?? "",
            serialNo: device.serialNo,
            status: device.status,
            assignedAt: device.assignedAt,
            apiKey: device.apiKey,
            modelId: device.model.id,
            modelName: device.model.name,
            userId: device.user?.id ?? "",
            username: device.user?.name ?? "",
            email: device.user?.email ?? "",
            lat: device.lat?.toString() ?? "",
            lng: device.lng?.toString() ?? "",
            createdAt: device.createdAt,
        }
        : null;


    const formattedSubscription = device && device.user ? {
        id: device.id,
        serialNo: device.serialNo,
        email: device.user.email,
        paidAmount: deviceSubscripion?.paidAmount,
        planType: deviceSubscripion?.planType,
        status: deviceSubscripion?.status,
        startDate: deviceSubscripion?.startDate,
        endDate: deviceSubscripion?.endDate,
        autoRenew: deviceSubscripion?.autoRenew,
        adminModified: deviceSubscripion?.adminModified,
        notes: deviceSubscripion?.notes,
        pricingPlans: device.model.pricingPlans
    } : null

    const subscriptionHistory = deviceId === 'new'
        ? null
        : await prisma.deviceSubscription.findMany({
            where: {
                deviceId: device?.id,
                userId: device?.user?.id
            }
        })

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8'>
                <DeviceForm initialData={formattedDevice} />
                {
                    device && (<>
                        <DeviceSubscription initialData={formattedSubscription} />
                    </>)
                }
                {
                    (device && subscriptionHistory) && (
                        <>
                            <section className="space-y-8 my-4">
                                <div className="flex items-center justify-between px-2">
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">Subscription History</h3>
                                        <p className="text-sm text-muted-foreground">Detailed logs of all past and present plans for this device.</p>
                                    </div>
                                    <Badge variant="outline" className="h-fit py-1">
                                        Total Records: {subscriptionHistory.length || 0}
                                    </Badge>
                                </div>

                                <DeviceSubscriptionTable data={subscriptionHistory || []} />
                            </section>
                        </>
                    )
                }

                 {
                    device && (<>
                        <DeleteDeviceSection id={device.id} serialNo={device.serialNo} />
                    </>)
                }
            </div>
        </div>
    )
}

export default SingleDeviceModelPage
