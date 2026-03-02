"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge" // Optional: for status styling

export type PricingPlanColumn = {
    id: string
    modelName: string
    duration: string
    price: string
    isEnabled: boolean
    createdAt: string
}

// Helper to make the Enum readable
const durationMap: Record<string, string> = {
    "THREE_MONTHS": "3 Months",
    "SIX_MONTHS": "6 Months",
    "TWELVE_MONTHS": "12 Months",
};

export const columns: ColumnDef<PricingPlanColumn>[] = [
    {
        accessorKey: "modelName",
        header: "Device Model",
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => durationMap[row.original.duration] || row.original.duration
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "isEnabled",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.isEnabled ? "default" : "destructive"}>
                {row.original.isEnabled ? "Active" : "Disabled"}
            </Badge>
        )
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