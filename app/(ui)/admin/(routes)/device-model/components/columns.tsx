"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import { ContentWriterStatus } from "@prisma/client"

export type DeviceModelColumn
    = {
        id: string
        name: string
        createdAt: string
    }

export const columns: ColumnDef<DeviceModelColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
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