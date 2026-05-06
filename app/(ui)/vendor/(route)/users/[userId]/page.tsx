"use client"

import {
    ArrowLeft, Mail, Phone, Building2, Landmark,
    ShieldCheck, Calendar, Trash2, Loader2
} from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Status } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { http } from '@/lib/http'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserData {
    id: string;
    name: string;
    email: string;
    organizationName: string | null;
    phoneNumber: string | null;
    createdAt: string;
    accountType?: string;
    status: Status
    gstNumber: string
}

const SingleUserDetailsPage = () => {
    const params = useParams()
    const router = useRouter()
    const userId = params.userId

    const { data: user, isLoading, isError } = useQuery<UserData>({
        queryKey: ['vendor-user', userId],
        queryFn: async () => {
            const response = await http.get(`/api/vendor/users/${userId}`)

            if (response.status === 200 && !response.data.error) {
                return response.data
            }

            throw new Error(response.data.message || 'Something went wrong');
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5
    })

    if (isLoading) {
        return (
            <div className="h-[70vh] w-full flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-gray-500 animate-pulse font-medium">Fetching user profile...</p>
            </div>
        )
    }

    if (isError || !user) {
        return (
            <div className="h-[70vh] w-full flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                    <Trash2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold">User not found</h2>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto min-h-screen space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 hover:bg-primary/5 text-gray-600 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Users
                </Button>
                {/* <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 border-gray-200">
                        <Edit3 className="h-4 w-4" /> Edit Profile
                    </Button>
                    <Button variant="destructive" className="flex items-center gap-2 bg-red-50 text-red-600 border-red-100 hover:bg-red-100">
                        <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Identity Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <Card className="border-none shadow-xl shadow-gray-200/50 bg-white rounded-2xl">
                        <div className="h-24 bg-linear-to-r from-primary/80 to-primary" />
                        <CardContent className="relative pt-0 text-center pb-8">
                            <div className="flex justify-center">
                                <div className="relative -mt-12 mb-4">
                                    <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg">
                                        <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl uppercase">
                                            {user.name.charAt(0)}
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "absolute bottom-0 right-0 h-6 w-6 border-4 border-white rounded-full transition-colors duration-300",
                                        user.status === 'APPROVED' ? 'bg-green-500' :
                                            user.status === 'PENDING' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                    )} />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 capitalize">{user.name}</h2>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "gap-1.5 h-6 px-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full border shadow-sm transition-all",
                                    getStatusStyles(user.status)
                                )}
                            >
                                <span className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    user.status === "APPROVED" && "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]",
                                    user.status === "PENDING" && "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]",
                                    (user.status === "REJECTED" || user.status === "BANNED") && "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"
                                )} />
                                {user.status}
                            </Badge>

                            <div className="mt-8 space-y-4 text-left px-2">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Mail className="h-4 w-4" /></div>
                                    <span className="text-sm truncate font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Phone className="h-4 w-4" /></div>
                                    <span className="text-sm font-medium">{user.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Calendar className="h-4 w-4" /></div>
                                    <span className="text-sm italic text-gray-400">
                                        Joined {user.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column: Detailed Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Business Details Section */}
                    <Card className="border-gray-100 shadow-sm ">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" /> Business Configuration
                            </CardTitle>
                            <Badge className={user.accountType === 'ORGANIZATION' ? "bg-blue-50 text-blue-700 hover:bg-blue-50" : "bg-orange-50 text-orange-700"}>
                                {user.accountType}
                            </Badge>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Organization Name</p>
                                    <p className="font-semibold text-gray-800">{user.organizationName || "Individual Account"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GST Number</p>
                                    <div className="flex items-center gap-2 font-mono text-primary font-bold">
                                        <Landmark className="h-4 w-4 text-gray-400" />
                                        {user.gstNumber || "Not Provided"}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Integrity Section */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" /> Security & Status
                            </CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800">Account Status</p>
                                    <p className="text-sm text-gray-500">Current operational state of the user account.</p>
                                </div>
                                <Badge className={cn("gap-1.5", getStatusStyles(user.status))}>
                                    <span className={cn(
                                        "h-1.5 w-1.5 rounded-full font-bold",
                                        user.status === "APPROVED" ? "bg-green-500" :
                                            user.status === "PENDING" ? "bg-amber-500" : "bg-red-500"
                                    )} />
                                    {user.status}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800">Password Management</p>
                                    <p className="text-sm text-gray-500">Trigger a secure password reset link for the user.</p>
                                </div>
                                <Button size="sm" variant="destructive" className="text-xs font-semibold">Only by Admin</Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-dashed border-gray-200 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800">Edit Details</p>
                                    <p className="text-sm text-gray-500">Any modification in user Details</p>
                                </div>
                                <Button size="sm" variant="destructive" className="text-xs font-semibold">Only by Admin</Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

export default SingleUserDetailsPage


const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
        case "APPROVED":
            return "bg-green-50 text-green-700 border-green-100 hover:bg-green-50";
        case "PENDING":
            return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50";
        case "REJECTED":
        case "BANNED":
            return "bg-red-50 text-red-700 border-red-100 hover:bg-red-50";
        default:
            return "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-50";
    }
};