export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { UserForm } from "./components/user-form"; // Updated import
import { redirect } from "next/navigation";

const UserPage = async ({
    params,
}: {
    params: Promise<{ userId: string }> 
}) => {
    const userId = (await params).userId;

    // Handle new user creation path
    if (userId === "new") {
        return (
            <div className='flex-col'>
                <div className='flex-1 space-y-4 p-8 pt-6'>
                    <UserForm initialData={null} />
                </div>
            </div>
        );
    }

    // Fetch unique user from the user table
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            accountType: true,
            status:true,
            email: true,
            organizationName: true,
            gstNumber: true
        }
    });

    // Redirect if user doesn't exist
    if (!user) {
        redirect("/admin/users");
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <UserForm
                    initialData={user}
                />
            </div>
        </div>
    )
}

export default UserPage;