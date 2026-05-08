"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

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
            <section className="min-h-screen">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Vendor's Registerd Users (${data.length})`}
                        description="Manage user accounts, account types, and associated devices or addresses."
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
                        Back
                    </Button>
                </div>

                <Separator className="mt-5" />

                <DataTable
                    columns={columns}
                    data={data}
                    searchKey="email"
                />

                <Separator />
            </section>
        </>
    )
}