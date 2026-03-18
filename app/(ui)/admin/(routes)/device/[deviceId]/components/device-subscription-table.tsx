"use client"

import {
    Calendar,
    CreditCard,
    ShieldCheck,
    Clock,
    FileText
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DeviceSubscription } from "@prisma/client";

interface DeviceSubscriptionTableProps {
    data: DeviceSubscription[];
}

export const DeviceSubscriptionTable = ({ data }: DeviceSubscriptionTableProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                No subscription records found for this device.
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="w-37.5">Status</TableHead>
                        <TableHead>Plan Details</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Paid Amount</TableHead>
                        <TableHead>Modifications</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((sub) => (
                        <TableRow key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell>
                                <Badge
                                    variant={sub.status === "ACTIVE" ? "default" : "secondary"}
                                    className={cn(
                                        sub.status === "ACTIVE" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-500",
                                        "capitalize"
                                    )}
                                >
                                    {sub.status.toLowerCase()}
                                </Badge>
                                {sub.autoRenew && (
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-600 font-bold uppercase">
                                        <ShieldCheck className="h-3 w-3" /> Auto-Renew
                                    </div>
                                )}
                            </TableCell>

                            <TableCell>
                                <div className="font-medium text-slate-900">{sub.planType.replace('_', ' ')}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> {sub.notes || "No admin notes"}
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-col gap-1 text-sm">
                                    <span className="flex items-center gap-1 text-slate-600">
                                        <Clock className="h-3 w-3 text-emerald-500" /> {format(new Date(sub.startDate), "MMM dd, yyyy")}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                                        <Calendar className="h-3 w-3 text-rose-500" /> {format(new Date(sub.endDate), "MMM dd, yyyy")}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1 font-mono font-bold text-slate-700">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    ₹{sub.paidAmount.toLocaleString()}
                                </div>
                            </TableCell>

                            <TableCell>
                                {sub.adminModified ? (
                                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                        Admin Override
                                    </Badge>
                                ) : (
                                    <span className="text-xs text-muted-foreground italic">System Generated</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
