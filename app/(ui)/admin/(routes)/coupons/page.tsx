import { format } from "date-fns";

import { prisma } from "@/lib/prisma";
import { CouponClient } from './components/client';
import { CouponColumn } from './components/columns';

const CouponPage = async () => {
   
    const coupons = await prisma.coupon.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

   
    const formattedCoupons: CouponColumn[] = coupons.map((item) => {
        
        const isExpired = new Date() > new Date(item.validUntil);
        const isFullyUsed = item.maxUsage ? item.usedCount >= item.maxUsage : false;

        let statusLabel = "Active";
        if (!item.isActive) statusLabel = "Disabled";
        else if (isExpired) statusLabel = "Expired";
        else if (isFullyUsed) statusLabel = "Limit Reached";

        return {
            id: item.id,
            code: item.code,
            description: item.description,
            discountType: item.discountType, // FIXED or PERCENTAGE
            discountValue: item.discountValue,
            // Displays usage as "5/100" or "5/∞"
            usage: `${item.usedCount} / ${item.maxUsage ?? "∞"}`,
            status: statusLabel,
            validUntil: format(item.validUntil, "MMMM do, yyyy"),
            createdAt: format(item.createdAt, "MMMM do, yyyy"),
        };
    });

    return (
        <section className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6 animate-in fade-in slide-in-from-right-1'>
                <CouponClient data={formattedCoupons} />
            </div>
        </section>
    );
};

export default CouponPage;