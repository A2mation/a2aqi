'use client'

import { useState } from "react"

import { Sidebar } from "@/components/users-ui/dashboard/Sidebar"
import { Header } from "@/components/users-ui/dashboard/Header"
import { TeamContent } from "@/components//users-ui/team/team-content"
import { AddTeamMember } from "@/components//users-ui/team/add-team"




export default function TeamPage() {
    const [isCollapsed, setIsCollapsed] = useState(false);


    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden lg:block">
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            </div>

            <main className="flex-1 p-4 lg:p-6 lg:ml-64">
                <Header
                    title="Team"
                    description="Manage your team members and their roles."
                    actions={
                        <>
                            <AddTeamMember />
                        </>
                    }

                />

                <div className="mt-6">
                    <TeamContent />
                </div>
            </main>
        </div>
    )
}

