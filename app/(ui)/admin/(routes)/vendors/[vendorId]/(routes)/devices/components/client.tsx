"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import Heading from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

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
            <section className="min-h-screen">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Manage Vendor's Device (${data.length})`}
                        description="Manage device of a2aqi.com"
                    />
                    <div className="flex items-center gap-x-2">
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
                </div>

                <Separator />
                <DataTable columns={columns} data={data} searchKey="serialNo" />
            </section>
        </>
    )
}