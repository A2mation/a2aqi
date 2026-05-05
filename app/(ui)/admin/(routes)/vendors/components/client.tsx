"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

import { VendorColumn, columns } from "./columns" 

interface VendorClientProps {
    data: VendorColumn[]
}

export const VendorClient = ({
    data
}: VendorClientProps) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Vendors (${data.length})`}
                    description="Manage vendor accounts, status, and GST information"
                />
            </div>

            <Separator />

            <DataTable
                columns={columns}
                data={data}
                searchKey="name"
            />

            <Heading
                title="API Documentation"
                description="API endpoints for managing vendor entities"
            />
            <Separator />
            <ApiList
                entityName="vendors"
                entityIdName="vendorId"
            />
        </>
    )
}