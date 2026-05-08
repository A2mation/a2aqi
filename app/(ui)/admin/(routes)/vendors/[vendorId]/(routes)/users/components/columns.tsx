"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

// Updated type to match your Prisma Model
export type UserColumn = {
    id: string
    name: string
    email: string
    accountType: string // From accountType enum
    status: string      // From status enum
    deviceCount: number // Derived from devices[]
    createdAt: string
}

export const columns: ColumnDef<UserColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="flex items-center w-fit gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">
                <code className="font-mono text-[13px] font-medium text-slate-700 tracking-wider">
                    {row.original.email}
                </code>
            </div>
        )
    },
    {
        accessorKey: "accountType",
        header: "Account Type",
        cell: ({ row }) => {
            const type = row.original.accountType.toLowerCase();
            const isPersonal = type === "personal";

            return (
                <Badge
                    
                    className={`
                    capitalize font-medium px-2 py-0.5 border-none
                    ${isPersonal
                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-50"
                            : "bg-violet-100 text-violet-700 hover:bg-violet-50"
                        }
                `}
                >
                    {type}
                </Badge>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            const statusMap: Record<string, string> = {
                APPROVED: "bg-emerald-500 hover:bg-emerald-600 text-white",
                PENDING: "bg-yellow-500 hover:bg-yellow-600 text-white",
                REJECTED: "bg-red-500 hover:bg-red-600 text-white",
                BANNED: "bg-red-500 hover:bg-red-600 text-white",
            };
            return (
                <Badge
                    className={`capitalize shadow-sm ${statusMap[status] || "bg-secondary text-secondary-foreground"}`}
                >
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "deviceCount",
        header: "Devices",
        cell: ({ row }) => (
            <div className="font-medium px-2">
                {row.original.deviceCount}
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