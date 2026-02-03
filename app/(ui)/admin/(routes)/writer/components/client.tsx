"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { WriterColumn, columns } from "./columns"

interface WriterClientProps {
    data: WriterColumn[]
}

export const WriterClient = ({
    data
}: WriterClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Manage Writers (${data.length})`}
                    description="Manage writer of a2aqi.com"
                />
                <Button onClick={() => router.push(`/admin/writer/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>

            <Separator />
            <DataTable columns={columns} data={data} searchKey="username" />


            <Heading
                title={"API"}
                description={"API calls for Writer."}
            />
            <Separator />
            <ApiList entityName="admin/writer" entityIdName="writerId" />
        </>
    )
}