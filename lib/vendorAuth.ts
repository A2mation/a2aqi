import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";

export async function vendorGuard() {
    const session = await getAuthSession();

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.user.role !== ROLE.VENDOR) {
        throw new Error("VENDOR ACCESS ONLY ROUTE");
    }

    const vendor = await prisma.admin.findUnique({
        where: {
            id: session.user.id,
            role: 'VENDOR'
        },
    });

    if (!vendor) {
        throw new Error("Unauthorized");
    }

    return { vendor, session };
}
