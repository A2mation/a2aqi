import { prisma } from "@/lib/prisma";
import { CouponForm } from "./components/coupon-form";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/Heading";
import { DataTable } from "@/components/ui/data-table";
import { redemptionColumns } from "../components/columns";

const SingleCouponPage = async ({
    params,
}: {
    params: Promise<{ couponId: string }>
}) => {
    const { couponId } = await params;

    if (couponId === "new") {
        return (
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 animate-in fade-in slide-in-from-right-1">
                    <CouponForm initialData={null} />
                </div>
            </div>
        );
    }

    const coupon = await prisma.coupon.findUnique({
        where: {
            id: couponId,
        },
        select: {
            id: true,
            code: true,
            description: true,
            discountType: true,
            discountValue: true,
            maxUsage: true,
            validFrom: true,
            validUntil: true,
            createdAt: true,
            isActive: true,
            couponRedemptions: {
                select: {
                    id: true,
                    discountApplied: true,
                    paymentId: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    device: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });


    const formattedCoupon = coupon
        ? {
            id: coupon.id,
            code: coupon.code,
            description: coupon.description ?? "",
            discountType: coupon.discountType,
            discountValue: Number(coupon.discountValue),
            usage: coupon.maxUsage ? Number(coupon.maxUsage) : undefined,
            validUntil: coupon.validUntil.toISOString(),
            isActive: coupon.isActive,
            createdAt: coupon.createdAt,
        }
        : null;

    const formattedRedemptions = coupon?.couponRedemptions.map((item) => ({
        id: item.id,
        userName: item.user.name || "N/A",
        userEmail: item.user.email || "N/A",
        deviceName: item.device.name || "Unknown Device",
        discountApplied: `₹${item.discountApplied}`,
        paymentId: item.paymentId,
        createdAt: item.createdAt.toISOString(),
    })) || [];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 animate-in fade-in slide-in-from-right-1">
                <CouponForm initialData={formattedCoupon} />

                {couponId !== "new" && (
                    <div className="space-y-4">
                        <Separator />
                        <Heading
                            title={`Redemption History (${formattedRedemptions.length})`}
                            description="Recent usage of this coupon code across the platform"
                        />
                        <DataTable
                            columns={redemptionColumns}
                            data={formattedRedemptions}
                            searchKey="userName"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleCouponPage;