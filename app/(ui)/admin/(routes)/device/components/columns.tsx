"use client"

import { ColumnDef } from "@tanstack/react-table"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Copy, Hash, HelpCircle, History, UserCircle, UserMinus } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"

export type Device
    = {
        id: string
        name: string
        serialNo: string
        status: string
        model: string
        user: string
        assignedAt: Date | null
        createdAt: Date
    }

export const columns: ColumnDef<Device>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.getValue("name") as string;

            const isLong = name.length > 20;
            const displayName = isLong ? `${name.substring(0, 20)}...` : name;

            return (
                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-help font-semibold text-slate-800 dark:text-slate-200">
                                {displayName}
                            </span>
                        </TooltipTrigger>
                        {isLong && (
                            <TooltipContent side="top" className="max-w-75 break-all">
                                <p>{name}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            );
        }
    },
    {
        accessorKey: "serialNo",
        header: "Serial No.",
        cell: ({ row }) => {
            const serial = row.getValue("serialNo") as string;

            const handleCopy = () => {
                navigator.clipboard.writeText(serial);
                toast.success("Copied to clipboard", {
                    style: {
                        borderRadius: '8px',
                        background: '#333',
                        color: '#fff',
                        fontSize: '14px'
                    },
                    position: "bottom-center"
                });
            };

            return (
                <div className="group flex items-center gap-3">
                    {/* Technical badge look */}
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">
                        <code className="font-mono text-[13px] font-medium text-slate-700 tracking-wider">
                            {serial}
                        </code>
                    </div>

                    {/* Hover-action Copy Button */}
                    <button
                        onClick={handleCopy}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 active:scale-95"
                        title="Copy Serial"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </button>
                </div>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            const statusMap: Record<string, string> = {
                ASSIGNED: "bg-emerald-500 hover:bg-emerald-600 text-white",
                UNASSIGNED: "bg-red-500 hover:bg-red-600 text-white",
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
        accessorKey: "model",
        header: "Device Model",
        cell: ({ row }) => {
            const model = row.getValue("model") as string;

            return (
                <div className="group flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">
                        <code className="font-mono text-[13px] font-medium text-slate-700 tracking-wider">
                            {model}
                        </code>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.getValue("user") as string;


            return (
                <div className="flex items-center gap-2.5">
                    {user !== 'Not Assigned' ? (
                        <>
                            {/* Icon/Avatar for assigned user */}
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserCircle className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-foreground">
                                {user}
                            </span>
                        </>
                    ) : (
                        <>
                            {/* Style for Unassigned state */}
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
                                <UserMinus className="h-4 w-4" />
                            </div>
                            <span className="text-sm italic text-muted-foreground/60">
                                Not Assigned
                            </span>
                        </>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: "assignedAt",
        header: "Assigned At",
        cell: ({ row }) => {
            const dateValue = row.getValue("assignedAt");

            const date = new Date(dateValue as string);
            const formattedDate = format(date, "MMM d, yyyy");

            const relativeTime = formatDistanceToNow(date, { addSuffix: true });

            if (!dateValue) {
                return (
                    <div className="flex items-center gap-2 text-muted-foreground/50">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span className="text-xs font-light">—</span>
                    </div>
                );
            }



            return (
                <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        {formattedDate}
                    </div>

                    <div className="flex items-center gap-1.5 ml-5">
                        <History className="h-3 w-3 text-muted-foreground/70" />
                        <span className="text-[11px] text-muted-foreground font-normal lowercase">
                            {relativeTime}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const dateValue = row.getValue("createdAt");

            const date = new Date(dateValue as string);
            const formattedDate = format(date, "MMM d, yyyy");

            const relativeTime = formatDistanceToNow(date, { addSuffix: true });

            if (!dateValue) {
                return (
                    <div className="flex items-center gap-2 text-muted-foreground/50">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span className="text-xs font-light">—</span>
                    </div>
                );
            }

            return (
                <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        {formattedDate}
                    </div>
                    <div className="flex items-center gap-1.5 ml-5">
                        <History className="h-3 w-3 text-muted-foreground/70" />
                        <span className="text-[11px] text-muted-foreground font-normal lowercase">
                            {relativeTime}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]