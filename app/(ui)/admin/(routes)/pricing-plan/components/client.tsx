"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { PricingPlanColumn, columns } from "./columns"

interface PricingPlanClientProps {
    data: PricingPlanColumn[]
}

export const PricingPlanClient = ({
    data
}: PricingPlanClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Subscription Plans (${data.length})`}
                    description="Manage pricing and durations for device subscriptions"
                />
                <Button
                    onClick={() => router.push(`/admin/pricing-plan/new`)}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Plan
                </Button>
            </div>

            <Separator />

            <DataTable
                columns={columns}
                data={data}
                searchKey="modelName"
            />

            <Heading
                title="API Documentation"
                description="API endpoints for managing pricing plans"
            />
            <Separator />
            <ApiList
                entityName="admin/pricing-plan"
                entityIdName="pricingPlanId"
            />
        </>
    )
}