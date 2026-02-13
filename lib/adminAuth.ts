import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";

export async function adminGuard() {
    const session = await getAuthSession();

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.user.role !== ROLE.ADMIN) {
        throw new Error("ADMIN ACCESS ONLY ROUTE");
    }

    const admin = await prisma.admin.findUnique({
        where: { id: session.user.id },
    });

    if (!admin) {
        throw new Error("Unauthorized");
    }

    return { admin, session };
}
