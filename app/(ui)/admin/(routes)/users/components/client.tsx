"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { UserColumn, columns } from "./columns"

interface UserClientProps {
    data: UserColumn[]
}

export const UserClient = ({
    data
}: UserClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Users (${data.length})`}
                    description="Manage user accounts, account types, and associated devices or addresses."
                />
                <Button
                    onClick={() => router.push(`/admin/users/new`)}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New User
                </Button>
            </div>

            <Separator />

            <DataTable
                columns={columns}
                data={data}
                searchKey="email"
            />

            <Heading
                title="API Documentation"
                description="API endpoints for managing user entities"
            />
            <Separator />
            <ApiList
                entityName="admin/users"
                entityIdName="userId"
            />
        </>
    )
}