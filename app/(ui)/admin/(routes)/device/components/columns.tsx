"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type Device
    = {
        id: string
        name: string
        serialNo: string
        status: string
        model: string
        user: string
        assignedAt: string
        createdAt: string
    }

export const columns: ColumnDef<Device>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "serialNo",
        header: "Serial No.",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "model",
        header: "Device Model",
    },
    {
        accessorKey: "user",
        header: "User",
    },
    {
        accessorKey: "assignedAt",
        header: "Assigned At",
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