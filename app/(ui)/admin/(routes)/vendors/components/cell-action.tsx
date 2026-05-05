"use client"

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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
import { VendorColumn } from "./columns";

interface CellActionProps {
    data: VendorColumn; 
}

export const CellAction = ({ data }: CellActionProps) => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Vendor ID copied to clipboard.");
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            // const res = await http.delete(`/api/admin/vendors/${params.vendorId}`);

            // if (res.status == 200 && !res.data.error) {
            //     router.push('/admin/vendors');
            //     toast.success("Vendor account deleted.");
            //     router.refresh();
            // }

            // toast.error(res.data.message || "Cannot alter the details");
            // throw new Error(res.data.message || "Cannot alter the details");
            toast.error("Vendor Delete Feature Not Available");

        } catch (error: any) {
            toast.error("Unexpected error occurred while deleting the vendor");
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
                        Copy Vendor ID
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push(`/admin/vendors/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Vendor
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Vendor
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};