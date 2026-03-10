"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { http } from "@/lib/http";
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
import { CouponColumn } from "./columns";

interface CellActionProps {
    data: CouponColumn;
}

export const CellAction = ({ data }: CellActionProps) => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Coupon code copied to clipboard.");
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            const res = await http.delete(`/api/admin/coupons/${data.id}`);

            if (res.status === 200) {
                toast.success(res.data.message || "Coupon deleted successfully");
                router.refresh();
            }
            else if (res.status === 409) {
                toast.error(res.data.message || "Cannot delete coupon. It might have existing redemptions.");
            } else if (res.status === 401) {
                toast.error("You are not authorized to perform this action");
            } else if (res.status === 400) {
                toast.error("Invalid Coupon ID");
            } else {
                toast.error(res.data.message || "Something went wrong");
            }

        } catch (error: any) {
            toast.error("Unexpected error occurred");
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
                    {/* Changed copy logic to copy the CODE instead of ID, as it's more useful */}
                    <DropdownMenuItem onClick={() => onCopy(data.code)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/coupons/${data.id}`)} >
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};