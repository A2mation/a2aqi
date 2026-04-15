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
import { http } from "@/lib/http";
import { ModeratorColumn } from "./columns";

interface CellActionProps {
    data: ModeratorColumn; 
}

export const CellAction = ({ data }: CellActionProps) => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Moderator ID copied to clipboard."); // Updated text
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            // Updated endpoint to specifically target moderators
            const res = await http.delete(`/api/admin/moderators/${data.id}`);

            if (res.status === 200) {
                toast.success("Moderator deleted successfully");
                router.refresh();
            }
            else if (res.status === 409) {
                toast.error("This moderator has active calibrations and cannot be deleted.");
            } else if (res.status === 401) {
                toast.error("Unauthorized action");
            } else {
                toast.error(res.data?.message || "Something went wrong");
            }

        } catch (error: any) {
            toast.error("Unexpected error occurred while deleting the moderator");
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
                        Copy Moderator ID
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push(`/admin/moderators/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Moderator
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Moderator
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};