'use client'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Settings, Shield, User } from "lucide-react";

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
import { NavbarLogo } from '../ui/resizable-navbar'

const AdminNavbar = () => {
    const { data: session } = useSession();

    return (
        <div className='border-b bg-white dark:bg-black'>
            <div className='flex h-16 items-center px-4'>
                {/* Logo & Mobile Menu Trigger (Inside MainNav) */}
                <div className="flex items-center gap-x-2 md:gap-x-4">
                    <NavbarLogo />
                </div>

                {/* User Profile - Always stays on the right */}
                <div className="ml-auto flex items-center space-x-4">
                    <MainNav className="mx-6" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                                <Avatar className="h-8 w-8 md:h-9 md:w-9 cursor-pointer transition hover:opacity-80">
                                    <AvatarImage
                                        src={session?.user?.image ?? ""}
                                        alt={session?.user?.name ?? "User"}
                                    />
                                    <AvatarFallback className='border border-blue-500'>
                                        {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {session?.user?.name ?? "Admin"}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {session?.user?.email ?? ""}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Shield className="mr-2 h-4 w-4" /> Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => signOut({ callbackUrl: "/admin/sign-in" })}
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

export default AdminNavbar;