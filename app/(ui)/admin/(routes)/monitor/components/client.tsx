"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { MonitorColumn, columns } from "./columns"

interface MonitorClientProps {
    data: MonitorColumn[]
}

export const MonitorClient = ({
    data
}: MonitorClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Monitors (${data.length})`}
                    description="Manage monitor accounts, permissions, and assigned devices"
                />
                <Button
                    onClick={() => router.push(`/admin/monitor/new`)}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Monitor
                </Button>
            </div>

            <Separator />

            <DataTable
                columns={columns}
                data={data}
                searchKey="name" 
            />

            <Heading
                title="API Documentation"
                description="API endpoints for managing monitor entities"
            />
            <Separator />
            <ApiList
                entityName="monitors"
                entityIdName="monitorId"
            />
        </>
    )
}