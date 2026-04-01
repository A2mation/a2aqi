import { Skeleton } from "@/components/ui/skeleton"

export function UniversalAQIDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <main className="pt-10 pb-12 px-4 md:px-10 max-w-400 mx-auto space-y-10">
                
                {/* Hero Section Skeleton */}
                <div className="rounded-[3rem] p-8 md:p-10 border border-border/40 bg-muted/5 shadow-2xl min-h-112.5 flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Top Row: Pagination & Button */}
                    <div className="px-2 my-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
                        <Skeleton className="h-8 w-64 rounded-xl" />
                        <Skeleton className="h-11 w-full md:w-40 rounded-2xl" />
                    </div>

                    <div className="relative z-10 w-full lg:max-w-[65%] space-y-6">
                        {/* Status Badge */}
                        <Skeleton className="h-8 w-32 rounded-full" />
                        
                        {/* Title Lines */}
                        <div className="space-y-3">
                            <Skeleton className="h-16 md:h-24 w-full rounded-2xl" />
                            <Skeleton className="h-16 md:h-24 w-[80%] rounded-2xl" />
                        </div>

                        {/* Description */}
                        <div className="border-l-4 pl-4 border-muted/20 space-y-2">
                            <Skeleton className="h-4 w-full max-w-md" />
                            <Skeleton className="h-4 w-[60%] max-w-md" />
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-28 rounded-3xl" />
                            ))}
                        </div>
                    </div>

                    {/* Hero Footer */}
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mt-12 pt-8 border-t border-border/10">
                        <div className="flex items-baseline gap-4">
                            <Skeleton className="h-24 w-32 md:h-32 md:w-48 rounded-2xl" />
                            <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>
                        <div className="space-y-2 text-right">
                            <Skeleton className="h-3 w-20 ml-auto" />
                            <Skeleton className="h-8 w-32 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Recommendations Grid Skeleton */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border border-border/60 p-8 rounded-[2.5rem] space-y-4">
                            <Skeleton className="size-12 rounded-2xl" />
                            <Skeleton className="h-6 w-32 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[90%]" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* Table Area Skeleton */}
                <section className="pt-10 border-t border-border/40 space-y-10">
                    <Skeleton className="h-100 w-full rounded-4xl" />
                </section>
            </main>
        </div>
    )
}