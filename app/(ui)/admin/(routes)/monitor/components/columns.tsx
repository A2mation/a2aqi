"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

export type MonitorColumn = {
    id: string
    name: string
    email: string
    status: string
    tag: string
    deviceCount: number
    createdAt: string
}

const statusMap: Record<string, string> = {
    "ACTIVE": "Active",
    "INACTIVE": "Inactive",
    "PENDING": "Pending",
};

export const columns: ColumnDef<MonitorColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "tag",
        header: "Tag",
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.tag}
            </Badge>
        )
    },
    {
        accessorKey: "deviceCount",
        header: "Linked Devices",
        cell: ({ row }) => (
            <div className="font-medium px-2">
                {row.original.deviceCount}
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={status === "ACTIVE" ? "success" : "destructive"}
                >
                    {statusMap[status] || status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date Created",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]