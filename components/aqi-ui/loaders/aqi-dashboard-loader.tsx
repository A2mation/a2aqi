import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const AQIDashboardLoader = () => {
    return (
        <section className="min-h-screen bg-background p-6 md:p-10">
            {/* Nav/Header Spacer */}
            <div className="h-20 w-full mb-8" />

            <div className="max-w-350 mx-auto space-y-12">

                {/* --- Top Grid: Hero & Map --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* LEFT COLUMN: HERO SECTION (8 Columns) */}
                    <div className="lg:col-span-8">
                        <Card className="rounded-4xl p-8 md:p-12 border border-border/60 relative overflow-hidden bg-muted/10 h-full flex flex-col justify-between min-h-112.5">
                            <div className="relative z-10">
                                {/* Pulse Status Badge */}
                                <div className="flex items-center justify-between mb-8">
                                    <Skeleton className="h-8 w-64 rounded-full" />
                                    <Skeleton className="h-4 w-24 rounded-md hidden md:block opacity-50" />
                                </div>

                                {/* Main Heading */}
                                <div className="space-y-4">
                                    <Skeleton className="h-16 md:h-20 w-full md:w-[85%]" />
                                    <Skeleton className="h-16 md:h-20 w-[60%]" />
                                </div>

                                {/* Weather Quick-Stats Row (NEW) */}
                                <div className="mt-10 flex flex-wrap gap-4">
                                    <Skeleton className="h-16 w-40 rounded-2xl" />
                                    <Skeleton className="h-16 w-40 rounded-2xl" />
                                </div>
                            </div>

                            {/* Bottom AQI & Recommendation Row */}
                            <div className="mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-24 opacity-50" />
                                    <Skeleton className="h-32 w-48 rounded-2xl" />
                                    <Skeleton className="h-3 w-32 opacity-40" />
                                </div>
                                <Skeleton className="h-28 w-full max-w-sm rounded-3xl" />
                            </div>

                            {/* Mood Image Placeholder (Subtle Watermark effect) */}
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-5">
                                <Skeleton className="h-64 w-64 rounded-full" />
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: MAP SECTION (4 Columns) */}
                    <div className="lg:col-span-4 h-full">
                        <Card className="rounded-4xl p-6 border border-border/60 h-full flex flex-col min-h-112.5">
                            {/* Map Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-3 w-20 opacity-50" />
                                </div>
                                <Skeleton className="h-8 w-28 rounded-full" />
                            </div>

                            {/* Map Content Area */}
                            <div className="relative grow rounded-2xl overflow-hidden border border-border/40 bg-muted/20">
                                <Skeleton className="h-full w-full" />

                                {/* Overlay Controls */}
                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                    <Skeleton className="h-10 w-32 rounded-xl" />
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                </div>

                                {/* Bottom Station Card */}
                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="p-3 rounded-xl bg-background/60 backdrop-blur-sm border flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-2.5 w-16" />
                                            <Skeleton className="h-3 w-28" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* --- Bottom Pollutant Cards Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-8 rounded-3xl border border-border/60 bg-muted/5">
                            <div className="flex justify-between mb-6">
                                <Skeleton className="h-3 w-16 opacity-50" />
                                <Skeleton className="h-4 w-12 rounded-full" />
                            </div>
                            <Skeleton className="h-12 w-24 mb-3" />
                            <Skeleton className="h-3 w-32 opacity-40" />
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}