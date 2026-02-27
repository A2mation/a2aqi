"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { User as UserIcon, Smartphone, ArrowRightLeft, CheckCircle2, Search, Info, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { http } from '@/lib/http';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '@/hooks/use-debounce';

export const AssignmentPanel = () => {
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 400);


    const { ref: loadMoreRef, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: usersLoading,
    } = useInfiniteQuery({
        queryKey: ["admin-users-infinite", debouncedSearch],
        queryFn: async ({ pageParam = null }) => {
            const res = await http.get(`/api/admin/user`, {
                params: {
                    cursor: pageParam,
                    search: debouncedSearch
                }
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
    });

    const { data: devices = [], isLoading: devicesLoading } = useQuery({
        queryKey: ["admin-devices", selectedUser?.id],
        queryFn: async () => {
            const res = await http.get(`/api/admin/user/device/${selectedUser.id}`);
            return res.data;
        },
        enabled: !!selectedUser?.id,
    });

    // Automatically fetch next page when user scrolls to bottom
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allUsers = useMemo(() => {
        // page.users?.filter(Boolean) removes any potential null/undefined items
        return data?.pages.flatMap((page) => page.users || []).filter(Boolean) ?? [];
    }, [data]);

    const handleUserSelect = (user: any) => {
        setSelectedUser(user);
        setSelectedDevice(null);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Manage User Inventory</h2>
                <p className="text-muted-foreground text-sm">Link hardware devices to specific user accounts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT: User Selection with Infinite Scroll */}
                <Card className={selectedUser ? "border-primary shadow-md transition-all" : ""}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-primary" /> Select User
                        </CardTitle>
                        <div className="relative mt-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search name or email..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-112.5">
                            <div className="space-y-2 pr-4">
                                {usersLoading ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                                ) : (
                                    <>
                                        {allUsers.map((user: any) => {
                                            // Add this safety check
                                            if (!user) return null;

                                            return (
                                                <button
                                                    key={user.id}
                                                    onClick={() => handleUserSelect(user)}
                                                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${selectedUser?.id === user.id
                                                        ? "bg-primary/10 border-primary shadow-sm"
                                                        : "hover:bg-muted border-transparent"
                                                        }`}
                                                >
                                                    <div className="overflow-hidden">
                                                        <p className="font-medium text-sm truncate">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                    </div>
                                                    {selectedUser?.id === user.id && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                                </button>
                                            );
                                        })}

                                        {/* Intersection Observer Trigger */}
                                        <div ref={loadMoreRef} className="py-4 flex justify-center">
                                            {isFetchingNextPage ? (
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            ) : hasNextPage ? (
                                                <div className="h-1" /> // Invisible spacer to trigger load
                                            ) : allUsers.length > 0 ? (
                                                <p className="text-xs text-muted-foreground">No more users found.</p>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">No users match your search.</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* RIGHT: Device Selection */}
                <Card className={!selectedUser ? "opacity-50 grayscale select-none" : "border-primary/40 shadow-sm"}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-primary" />
                            {selectedUser ? `${selectedUser.name}'s Inventory` : 'User Inventory'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!selectedUser ? (
                            <div className="h-112.5 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-xl">
                                <Smartphone className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
                                <p className="text-sm text-muted-foreground">Select a user to view their associated devices.</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-112.5">
                                <div className="space-y-2 pr-4">
                                    {devicesLoading ? (
                                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
                                    ) : devices.length > 0 ? (
                                        devices.map((device: any) => (
                                            <button
                                                key={device.id}
                                                onClick={() => setSelectedDevice(device)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${selectedDevice?.id === device.id
                                                    ? "bg-primary/10 border-primary shadow-sm"
                                                    : "hover:bg-muted border-transparent"
                                                    }`}
                                            >
                                                <div className="space-y-1">
                                                    <p className="font-medium text-sm">{device.name || "Unnamed Device"}</p>
                                                    <div className="flex items-center gap-2">
                                                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                            {device.serialNo}
                                                        </code>
                                                        <Badge variant={device.isActive ? "default" : "secondary"} className="text-[10px] h-4">
                                                            {device.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {selectedDevice?.id === device.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center border rounded-xl bg-muted/20">
                                            <Info className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-xs text-muted-foreground">This user has no devices assigned.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Footer Summary Bar */}
            {selectedUser && selectedDevice && (
                // TODO :  Add details all the user api's for admin testing
                <div className="bg-primary p-4 rounded-2xl text-primary-foreground flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/20 rounded-lg"><ArrowRightLeft className="h-5 w-5" /></div>
                        <div>
                            <p className="text-xs opacity-80 uppercase font-bold tracking-tight">Active Selection</p>
                            <p className="text-sm font-medium">{selectedUser.name} <span className="opacity-50 mx-1">/</span> {selectedDevice.name}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};