"use client"

import React from "react";
import { useSession } from "next-auth/react";
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "./avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"


interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {

    const session = useSession();

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex justify-between">
                            <div>
                                {title}
                            </div>
                            {session.data && (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="outline-none">
                                                <Avatar className="w-8 h-8 mr-2 cursor-pointer">
                                                    <AvatarFallback className="text-xs bg-blue-700 text-primary-foreground font-medium">
                                                        {session.data.user.name
                                                            ?.split(" ")
                                                            .map((n: any) => n[0])
                                                            .join("")
                                                            .toUpperCase()
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem
                                                onClick={() => signOut({ callbackUrl: "/user/sign-in" })}
                                                className="cursor-pointer"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        {children}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}