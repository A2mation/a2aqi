import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
    return (
        <div className="space-y-6">
            {/* SELECT SKELETON */}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-50 rounded-md" />
            </div>

            {/* CARDS SKELETON */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-4 shadow-lg border-none bg-card">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {/* Icon Circle */}
                                <Skeleton className="h-8 w-8 rounded-full" />
                                {/* Label Text */}
                                <Skeleton className="h-4 w-20" />
                            </div>
                            {/* Arrow Circle */}
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>

                        {/* Value Text */}
                        <Skeleton className="h-10 w-24 mb-3" />

                        {/* Subtext */}
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* CHART SKELETON */}
            <Card className="p-6 shadow-lg border-none">
                <div className="space-y-4">
                    {/* Chart Header */}
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>

                    {/* Main Chart Area Area */}
                    <Skeleton className="h-87.5 w-full rounded-xl" />
                </div>
            </Card>
        </div>
    );
}