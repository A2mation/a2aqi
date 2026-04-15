"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

export type ModeratorColumn = {
    id: string
    name: string
    email: string
    role: string
    calibrationCount: number
    createdAt: string
}

export const columns: ColumnDef<ModeratorColumn>[] = [
    {
        accessorKey: "name",
        header: "Moderator Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <Badge variant="secondary">
                {row.original.role}
            </Badge>
        )
    },
    {
        accessorKey: "calibrationCount",
        header: "Calibrations Managed",
        cell: ({ row }) => (
            <div className="font-medium px-2">
                {row.original.calibrationCount}
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Joined Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]