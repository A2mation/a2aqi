import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const AQIDashboardLoader = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Map Skeleton */}
            <div className="relative h-[35vh]">
                <Skeleton className="h-full w-full rounded-none" />
            </div>

            {/* Dashboard Skeleton Container */}
            <div className="max-w-400 mx-auto px-4 -mt-32 relative z-10 pb-12">
                <Card className="shadow-2xl p-6 sm:p-8 lg:p-10 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">

                    {/* Header Skeleton */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-62.5 md:w-100" /> {/* Title */}
                            <Skeleton className="h-6 w-45 md:w-62.5" />   {/* Location */}
                            <Skeleton className="h-4 w-35" />             {/* Last Updated */}
                        </div>
                        <div className="flex gap-3">
                            <Skeleton className="h-12 w-32 rounded-xl" />        {/* Locate Button */}
                            <Skeleton className="h-12 w-32 rounded-xl" />        {/* Map Button */}
                            <Skeleton className="h-12 w-12 rounded-xl" />        {/* Share Button */}
                        </div>
                    </div>

                    {/* Main Grid Skeleton */}
                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Left Column: AQI */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex items-start gap-8">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-20" />             {/* "Live AQI" text */}
                                    <Skeleton className="h-24 w-32" />            {/* Large AQI Number */}
                                </div>
                                <div className="space-y-2 mt-2">
                                    <Skeleton className="h-5 w-24" />             {/* "Air Quality" text */}
                                    <Skeleton className="h-10 w-32" />            {/* Label text */}
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Skeleton className="h-24 w-full rounded-xl" /> {/* PM10 Card */}
                                <Skeleton className="h-24 w-full rounded-xl" /> {/* PM2.5 Card */}
                            </div>

                            <Skeleton className="h-8 w-full rounded-full" />  {/* AQI Scale bar */}
                        </div>

                        {/* Middle Column: Image/Mood */}
                        <div className="lg:col-span-1 flex items-center justify-center">
                            <Skeleton className="h-70 w-80 rounded-xl" />   {/* Mood Icon circle */}
                        </div>

                        {/* Right Column: Weather */}
                        <div className="lg:col-span-1">
                            <Skeleton className="h-70 w-full rounded-[22px]" /> {/* Weather Card */}
                        </div>

                    </div>
                </Card>
            </div>
        </div>
    )
}
