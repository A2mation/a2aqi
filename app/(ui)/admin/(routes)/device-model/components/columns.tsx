"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"


export type DeviceModelColumn
    = {
        id: string
        name: string
        manufacturer: string,
        description: string
        isActive: boolean

        createdAt: string
    }

export const columns: ColumnDef<DeviceModelColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "manufacturer",
        header: "Manufacturer",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.isActive ? "success" : "destructive"}>
                {row.original.isActive ? "Active" : "Disabled"}
            </Badge>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]