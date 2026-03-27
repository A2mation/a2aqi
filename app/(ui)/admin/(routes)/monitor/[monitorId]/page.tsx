import { prisma } from "@/lib/prisma";
import { MonitorForm } from "./components/monitor-form";

const MonitorPage = async ({
    params,
}: {
    params: Promise<{ monitorId: string }>
}) => {
    const monitorId = (await params).monitorId;

    const monitor = monitorId === "new"
        ? null
        : await prisma.monitor.findUnique({
            where: {
                id: monitorId
            }
        });

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <MonitorForm
                    initialData={monitor}
                />
            </div>
        </div>
    )
}

export default MonitorPage;