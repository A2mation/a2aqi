"use client"

import { Mail, Phone, MoreHorizontal, ShieldCheck, Edit, Trash } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AddTeamMember, TeamDetailsProps } from "./add-team"

const teamMembers: TeamDetailsProps[] = [
    {
        name: "Ravi Kumar",
        email: "ravi@org.com",
        username: "ravi",
        permission: "READ",
        status: "active",
        linkedMaster: "Master Admin",
        planEndingDate: "2026-02-15",
        initials: "RK",
        password: "password123",
    },
    {
        name: "Sneha Sharma",
        email: "sneha@org.com",
        username: "sneha",
        permission: "READ_WRITE",
        status: "active",
        linkedMaster: "Master Admin",
        planEndingDate: "2026-03-01",
        initials: "SS",
        password: "password123",
    },
    {
        name: "Amit Verma",
        email: "amit@org.com",
        username: "amit",
        permission: "READ",
        status: "away",
        linkedMaster: "Master Admin",
        planEndingDate: "2026-02-25",
        initials: "AV",
        password: "password123",
    },
    {
        name: "Neha Singh",
        email: "neha@org.com",
        username: "neha",
        permission: "READ",
        status: "active",
        linkedMaster: "Master Admin",
        planEndingDate: "2026-02-10",
        initials: "NS",
        password: "password123",
    },
]


export function TeamContent() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member, index) => (
                    <Card
                        key={member.email}
                        className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <Avatar className="w-16 h-16 border-2 border-primary/20">
                                <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem asChild>
                                        <AddTeamMember initialData={member} triggerText="Edit" className="w-full" />
                                    </DropdownMenuItem>


                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600"
                                        onClick={() => console.log("Delete", member.email)}
                                    >
                                        <Trash /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>

                        <div className="space-y-3">
                            <div>
                                <h3 className="font-semibold text-lg">{member.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                    Linked to: {member.linkedMaster}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Badge variant={member.status === "active" ? "default" : "secondary"}>
                                    {member.status === "active" ? "Active" : "Away"}
                                </Badge>

                                <Badge variant={member.permission === "READ_WRITE" ? "default" : "outline"}>
                                    <ShieldCheck className="w-3 h-3 mr-1 inline" />
                                    {member.permission === "READ_WRITE" ? "Read/Write" : "Read Only"}
                                </Badge>
                            </div>

                            <div className="pt-2 border-t border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Plan End</span>
                                    <span className="font-semibold">{member.planEndingDate}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                    <Mail className="w-4 h-4 mr-1" />
                                    Email
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                    <Phone className="w-4 h-4 mr-1" />
                                    Call
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
