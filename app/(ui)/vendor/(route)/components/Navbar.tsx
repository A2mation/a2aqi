"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    User,
    Settings,
    LogOut,
    LayoutDashboard,
    Package,
    Bell
} from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NavbarLogo } from '@/components/ui/resizable-navbar'

export const VendorNavbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">

                {/* Left Side: Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center gap-4"
                >

                    <NavbarLogo />

                    <div className="hidden h-6 w-px bg-slate-200 md:block" />
                    <span className="hidden text-sm pt-1 font-medium text-slate-500 md:block">
                        Vendor Portal
                    </span>
                </motion.div>

                {/* Right Side: Actions & Profile */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center gap-4"
                >
                    {/* Notifications Placeholder */}
                    <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-blue-600">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
                    </Button>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-transparent hover:border-blue-100 transition-all">
                                <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Vendor" />
                                    <AvatarFallback className="bg-blue-600 text-white font-bold">VS</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 mt-2 shadow-xl border-slate-100" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-semibold leading-none text-slate-900">Swift Logistics Ltd.</p>
                                    <p className="text-xs leading-none text-muted-foreground">vendor@swift.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer py-2">
                                    <LayoutDashboard className="mr-2 h-4 w-4 text-slate-500" />
                                    <span>Dashboard</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">
                                    <Package className="mr-2 h-4 w-4 text-slate-500" />
                                    <span>My Products</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">
                                    <User className="mr-2 h-4 w-4 text-slate-500" />
                                    <span>Profile Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer py-2">
                                    <Settings className="mr-2 h-4 w-4 text-slate-500" />
                                    <span>Business Verification</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </motion.div>

            </div>
        </nav>
    )
}