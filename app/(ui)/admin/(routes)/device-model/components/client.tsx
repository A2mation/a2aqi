"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { DeviceModelColumn, columns } from "./columns"

interface DeviceModelClientProps {
    data: DeviceModelColumn[]
}

export const DeviceModelClient = ({
    data
}: DeviceModelClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Manage Device Models (${data.length})`}
                    description="Manage device Model of a2aqi.com"
                />
                <Button onClick={() => router.push(`/admin/device-model/new`)} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />


            <Heading
                title={"API"}
                description={"API calls for deviceModel."}
            />
            <Separator />
            <ApiList entityName="admin/device-model" entityIdName="deviceModelId" />
        </>
    )
}