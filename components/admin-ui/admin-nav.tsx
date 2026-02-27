'use client'
import { redirect } from 'next/navigation'
import { signOut } from "next-auth/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MainNav from '@/components/admin-ui/main-nav'
import { useSession } from 'next-auth/react'
import { LogOut, Settings, Shield, User } from "lucide-react";
import { NavbarLogo } from '../ui/resizable-navbar'

const AdminNavbar = () => {

    const session = useSession();

    return (
        <div className='border-b'>
            <div className='flex h-16 items-center px-4 py-2 gap-4'>
                <NavbarLogo />
                <MainNav />
                <div className="ml-auto flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none">
                                <Avatar className="h-9 w-9 cursor-pointer">
                                    <AvatarImage
                                        src={session.data?.user?.image ?? ""}
                                        alt={session.data?.user?.name ?? "User"}
                                    />
                                    <AvatarFallback className='border border-blue-500'>
                                        {session.data?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                {session.data?.user?.name ?? "Admin"}
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer">
                                <Shield className="mr-2 h-4 w-4" />
                                Role
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => signOut({ callbackUrl: "/admin/sign-in" })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </div>
    )
}

export default AdminNavbar