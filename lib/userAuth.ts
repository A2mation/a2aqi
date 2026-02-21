import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";

export async function userGuard() {
    const session = await getAuthSession();

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.user.role !== ROLE.USER) {
        throw new Error("USER ACCESS ONLY ROUTE");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        throw new Error("Unauthorized");
    }

    return { user, session };
}
