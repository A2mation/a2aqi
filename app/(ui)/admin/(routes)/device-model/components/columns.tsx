"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"


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