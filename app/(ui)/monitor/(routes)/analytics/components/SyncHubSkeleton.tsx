import { Skeleton } from "@/components/ui/skeleton";

export const SyncHubSkeleton = () => {
    return (
        <div className="bg-[#FDFDFD] min-h-screen">
            {/* Header Placeholder */}
            <div className="h-20 w-full border-b bg-white" />

            <div className="max-w-7xl mx-auto flex flex-col gap-6 p-8">
                {/* Top Statistics Bar Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white py-4 px-8 rounded-4xl border border-gray-100 shadow-sm">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-64 md:w-80" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-200/50 gap-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-8 w-16 rounded-xl" />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SIDEBAR Skeleton */}
                    <div className="w-full lg:w-80 space-y-4">
                        <div className="bg-indigo-50/30 p-4 rounded-4xl border border-indigo-100 mb-6">
                            <Skeleton className="h-3 w-20 mb-2" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-gray-100 p-5 rounded-4xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-2 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-5 rounded-full" />
                            </div>
                        ))}
                    </div>

                    {/* MAIN ANALYTICS HUB Skeleton */}
                    <div className="flex-1 bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-6 mb-12">
                            {/* Parameters Grid Skeleton */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                                ))}
                            </div>
                            <Skeleton className="h-10 w-40 rounded-2xl self-end md:self-auto" />
                        </div>

                        {/* Chart Area Skeleton */}
                        <div className="relative h-112.5 w-full flex items-end gap-2 pb-6">
                            {/* Visualizing a chart with bars of varying heights */}
                            <Skeleton className="absolute inset-0 rounded-3xl opacity-20" />
                            <div className="flex items-end justify-around w-full h-full px-4">
                                {[...Array(12)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="w-full max-w-2.5 rounded-t-lg"
                                        style={{ height: `${Math.random() * 60 + 20}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};