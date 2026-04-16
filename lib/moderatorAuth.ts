import { AdminRole } from "@prisma/client";

import { ROLE } from "@/types/type";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/auth";

export async function moderatorGuard() {
    const session = await getAuthSession();

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.user.role !== ROLE.MODERATOR) {
        throw new Error("MODERATOR ACCESS ONLY ROUTE");
    }

    const moderator = await prisma.admin.findUnique({
        where: {
            id: session.user.id,
            role: AdminRole.MODERATOR
        },
    });

    if (!moderator) {
        throw new Error("Unauthorized");
    }

    return { moderator, session };
}
