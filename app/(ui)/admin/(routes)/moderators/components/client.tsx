"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { ModeratorColumn, columns } from "./columns"

interface ModeratorClientProps {
    data: ModeratorColumn[]
}

export const ModeratorClient = ({
    data
}: ModeratorClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Moderators (${data.length})`}
                    description="Manage moderator accounts, permissions, and their assigned calibrations"
                />
                <Button
                    onClick={() => router.push(`/admin/moderators/new`)}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Moderator
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
                description="API endpoints for managing moderator entities"
            />
            <Separator />
            <ApiList
                entityName="moderators"
                entityIdName="moderatorId"
            />
        </>
    )
}