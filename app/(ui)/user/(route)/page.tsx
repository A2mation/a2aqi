
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/auth"
import ClientUserPage from "./components/ClientUserPage"


export default async function UserPage() {
    const session = await getAuthSession()

    if (!session?.user) {
        redirect("/user/sign-in")
    }

    const device = await prisma.device.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
    })

    if (device) {
        redirect(`/user/${device.id}/dashboard`)
    }

    return (
        <>
            <ClientUserPage />
        </>
    )
}