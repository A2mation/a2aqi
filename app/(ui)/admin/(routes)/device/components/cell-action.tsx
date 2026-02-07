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
import { DeviceColumn } from "./columns";
import AlertModal from "@/components/modals/alert-modal";
import { http } from "@/lib/http";


interface CellActionProps {
    data: DeviceColumn;
}


export const CellAction = ({ data }: CellActionProps) => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Device id copied to the clipboard.");
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            const res = await http.delete(`/api/admin/device/${data.id}`);
            
            if (res.status === 200) {
                toast.success(res.data.message || "Device deleted successfully");
                router.refresh();
            }
            else if (res.status === 409) {
                toast.error(res.data.message || "Please delete all Devices that are in this Device.");
            } else if (res.status === 401) {
                toast.error("You are not authorized to perform this action");
            } else if (res.status === 400) {
                toast.error("Invalid Device ID or ID not found");
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
                    <Button variant={"ghost"}>
                        <span className="sr-only">
                            Open Menu
                        </span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/device/${data.id}`)} >
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
};