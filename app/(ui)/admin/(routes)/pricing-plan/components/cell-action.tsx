"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation"; // Added useParams
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";
import { http } from "@/lib/http";
// Assuming your column definition is now for PricingPlan
import { PricingPlanColumn } from "./columns";

interface CellActionProps {
    data: PricingPlanColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
    const router = useRouter();
    const params = useParams(); // To get the deviceModelId from the URL if needed

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Pricing Plan ID copied to clipboard.");
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            // Updated endpoint to match pricing-plan structure
            const res = await http.delete(`/api/admin/pricing-plan/${data.id}`);

            if (res.status === 200) {
                toast.success("Pricing plan deleted successfully");
                router.refresh();
            }
            else if (res.status === 409) {
                toast.error("This plan is currently linked to active subscriptions and cannot be deleted.");
            } else if (res.status === 401) {
                toast.error("Unauthorized action");
            } else {
                toast.error(res.data?.message || "Something went wrong");
            }

        } catch (error: any) {
            toast.error("Unexpected error occurred while deleting the plan");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0">
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Plan ID
                    </DropdownMenuItem>

                    {/* Navigation updated: 
                       Commonly, plans are managed under the Device Model route:
                       /admin/device-model/[modelId]/pricing/[planId]
                    */}
                    <DropdownMenuItem onClick={() => router.push(`/admin/pricing-plan/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Plan
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setOpen(true)} className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Plan
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};