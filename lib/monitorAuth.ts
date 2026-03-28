import { getAuthSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/types/type";

export async function monitorGuard() {
    const session = await getAuthSession();

    if (!session) {
        throw new Error("Session not found");
    }

    if (session.user.role !== ROLE.MONITOR) {
        throw new Error("MONITOR ACCESS ONLY ROUTE");
    }

    const monitor = await prisma.monitor.findUnique({
        where: { id: session.user.id },
    });

    if (!monitor) {
        throw new Error("Unauthorized");
    }

    return { monitor, session };
}
