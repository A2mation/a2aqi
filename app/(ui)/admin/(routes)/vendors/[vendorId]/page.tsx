export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { VendorForm } from "./components/vendor-form";
import { redirect } from "next/navigation";

const VendorPage = async ({
    params,
}: {
    params: Promise<{ vendorId: string }>
}) => {
    const vendorId = (await params).vendorId;

    const vendor = await prisma.admin.findUnique({
        where: {
            id: vendorId,
            role: "VENDOR"
        }
    });

    if (!vendor) {
        redirect("/admin/vendors");
    }

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <VendorForm
                    initialData={vendor}
                />
            </div>
        </div>
    )
}

export default VendorPage;