"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { Device, columns } from "./columns"

interface DeviceClientProps {
    data: Device[]
}

export const DeviceClient = ({
    data
}: DeviceClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Manage Device Models (${data.length})`}
                    description="Manage device of a2aqi.com"
                />
                <Button onClick={() => router.push(`/admin/device/new`)} className="cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey="serialNo" />


            <Heading
                title={"API"}
                description={"API calls for device."}
            />
            <Separator />
            <ApiList entityName="admin/device" entityIdName="deviceId" />
        </>
    )
}