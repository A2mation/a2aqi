import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/auth";


export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ deviceId: string }>
}) {
    const session = await getAuthSession()

    if (!session?.user) {
        redirect("/user/sign-in")
    }
    const deviceId = (await params).deviceId;

    const device = await prisma.device.findFirst({
        where: {
            id: deviceId,
        },
        select: {
            id: true,
            serialNo: true,
            name: true
        }
    });
    // console.log(device)

    if (!device) {
        redirect('/user');
    }

    return (
        <>
            {children}
        </>
    )
}