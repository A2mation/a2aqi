"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { CouponColumn, columns } from "./columns"

interface CouponClientProps {
    data: CouponColumn[]
}

export const CouponClient = ({
    data
}: CouponClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Coupons (${data.length})`}
                    description="Manage discount codes and promotion settings"
                />
                <Button
                    onClick={() => router.push(`/admin/coupons/new`)}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Coupon
                </Button>
            </div>

            <Separator />
            {/* searchKey is coupon code */}
            <DataTable columns={columns} data={data} searchKey="code" />

            <div className="mt-8">
                <Heading
                    title={"API Documentation"}
                    description={"API reference for managing coupons programmatically"}
                />
                <Separator className="my-4" />
                <ApiList entityName="admin/coupons" entityIdName="couponId" />
            </div>
        </>
    )
}