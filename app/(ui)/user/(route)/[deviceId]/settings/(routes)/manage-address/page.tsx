'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { http } from '@/lib/http'
import { Header } from '@/components/users-ui/dashboard/Header'
import { Sidebar } from '@/components/users-ui/dashboard/Sidebar'
import { ManageAddressSection } from './components/Manage-Address'
import { AddressForm } from '../profile/components/Address-Form'

const ManageAddress = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const { data: user, isLoading } = useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const { data } = await http.get("/api/user")
            return data
        },
    })
    return (
        <>
            <div className="flex min-h-screen bg-background ">
                <div className="hidden lg:block">
                    <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                </div>

                <main className={cn(
                    "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
                    isCollapsed ? "lg:ml-16" : "lg:ml-60",
                )}>
                    <Header title="Settings" description="Manage your account preferences and application settings." />

                    <div className="mt-6 animate-in fade-in slide-in-from-right-1">
                        <AddressForm user={user} isLoading={isLoading} showAddressSection={false} />
                        <ManageAddressSection user={user} />
                    </div>
                </main>
            </div>
        </>
    )
}

export default ManageAddress
