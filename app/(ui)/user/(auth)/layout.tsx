import { getAuthSession } from "@/auth";
import { ROLE } from "@/types/type";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const session = await getAuthSession();

    if (session?.user && (session?.user.role === ROLE.USER)) {
        const device = await prisma.device.findFirst({
            where: { userId: session.user.id },
            select: { id: true },
        })
        if (!device) {
            redirect(`/user`);
        }
        redirect(`/user/${device.id}/dashboard`);
    }
    return (
        <>
            {children}
        </>
    );
}