"use client";

import { Skeleton } from "@/components/ui/skeleton"; // [cite: 1, 2]

const ChartLoader = () => {
    return (
        <div className="w-full h-full flex flex-col space-y-6">
            {/* Header Skeleton Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-3 rounded-full " />
                    <Skeleton className="h-6 w-40 rounded-md" />
                </div>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-36 rounded-md" />
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
            </div>

            {/* Main Chart Area Skeleton */}
            <div className="relative h-80 w-full rounded-xl border border-dashed border-muted/20 overflow-hidden">
                {/* Simulated Axis Lines */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between px-2">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-2 w-8" />
                    ))}
                </div>
            </div>

            {/* Dynamic Stats Footer Skeleton */}
            <div className="pt-4 border-t border-muted/50 flex flex-wrap gap-x-8 gap-y-3">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <Skeleton className="size-3 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-2 w-12 " />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default ChartLoader;