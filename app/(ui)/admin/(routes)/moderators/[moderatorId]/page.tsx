export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { ModeratorForm } from "./components/moderator-form"; 
import { redirect } from "next/navigation";

const ModeratorPage = async ({
    params,
}: {
    params: Promise<{ moderatorId: string }>
}) => {
    const moderatorId = (await params).moderatorId;

    if (moderatorId === "new") {
        return (
            <div className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <ModeratorForm initialData={null} />
                </div>
            </div>
        );
    }

    const moderator = await prisma.admin.findUnique({
        where: {
            id: moderatorId,
            role: "MODERATOR"
        }
    });

    if (!moderator) {
        redirect("/admin/moderators");
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ModeratorForm
                    initialData={moderator}
                />
            </div>
        </div>
    )
}

export default ModeratorPage;