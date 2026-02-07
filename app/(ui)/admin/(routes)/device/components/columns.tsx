"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type DeviceColumn
    = {
        id: string
        name: string
        serialNo: string
        model: string
        createdAt: string
    }

export const columns: ColumnDef<DeviceColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "serialNo",
        header: "Serial No.",
    },
    {
        accessorKey: "model",
        header: "Device Model",
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