"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

export type VendorColumn = {
    id: string
    name: string
    email: string
    role: string
    gstNumber: string | null
    status: string
    createdAt: string
}

export const columns: ColumnDef<VendorColumn>[] = [
    {
        accessorKey: "name",
        header: "Vendor Name",
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border w-fit border-slate-200 rounded-md">
                <code className="font-mono text-[13px] font-bold text-slate-700 tracking-wider">
                    {row.original.email || "N/A"}
                </code>
            </div>
        )
    },
    {
        accessorKey: "gstNumber",
        header: "GST Number",
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border w-fit border-slate-200 rounded-md">
                <code className="font-mono text-[13px] font-medium text-slate-700 tracking-wider">
                    {row.original.gstNumber || "N/A"}
                </code>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            const statusMap: Record<string, string> = {
                ACTIVE: "bg-emerald-500 hover:bg-emerald-600 text-white",
                PENDING: "bg-amber-500 hover:bg-amber-600 text-white",
                REJECTED: "bg-red-500 hover:bg-red-600 text-white",
                BANNED: "bg-destructive text-destructive-foreground",
                INACTIVE: "bg-slate-500 hover:bg-slate-600 text-white",
                SUSPENDED: "bg-orange-600 hover:bg-orange-700 text-white",
                DELETED: "bg-gray-800 text-white",
            };

            return (
                <Badge
                    className={`capitalize shadow-sm ${statusMap[status] || "bg-secondary text-secondary-foreground"}`}
                >
                    {status.toLowerCase()}
                </Badge>
            )
        }
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