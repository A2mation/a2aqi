"use client"

import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type RawCouponColumn = {
    id: string
    code: string
    description: string
    discountType: "FIXED" | "PERCENTAGE"
    discountValue: number
    usage: number | undefined
    isActive: boolean
    validUntil: string
    createdAt: Date
}

export type CouponColumn = {
    id: string
    code: string
    description: string | null
    discountType: "FIXED" | "PERCENTAGE"
    discountValue: number
    usage: string
    status: string // Active / Inactive
    validUntil: string
    createdAt: string
}

export const columns: ColumnDef<CouponColumn>[] = [
    {
        accessorKey: "code",
        header: "Coupon Code",
        cell: ({ row }) => <span className="font-mono font-bold">{row.original.code}</span>
    },
    {
        accessorKey: "discountValue",
        header: "Discount",
        cell: ({ row }) => {
            const { discountType, discountValue } = row.original;
            return discountType === "PERCENTAGE" ? `${discountValue}%` : `$${discountValue}`;
        }
    },
    {
        accessorKey: "usage",
        header: "Usage (Used/Max)",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                {row.original.status}
            </div>
        )
    },
    {
        accessorKey: "validUntil",
        header: "Expiry Date",
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

export type RedemptionColumn = {
    id: string;
    userName: string;
    userEmail: string;
    deviceName: string;
    discountApplied: string;
    paymentId: string;
    createdAt: string;
}

export const redemptionColumns: ColumnDef<RedemptionColumn>[] = [
    {
        accessorKey: "userName",
        header: "User",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.userName}</span>
                <span className="text-xs text-muted-foreground">{row.original.userEmail}</span>
            </div>
        )
    },
    {
        accessorKey: "deviceName",
        header: "Device",
    },
    {
        accessorKey: "discountApplied",
        header: "Discount Value",
        cell: ({ row }) => <span className="font-mono text-green-600">{row.original.discountApplied}</span>
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.createdAt), "MMM do, yyyy HH:mm")
    },
]