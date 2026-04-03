import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function SubscriptionExpireWheelSkeleton() {
    return (
        <Card className="flex flex-col border shadow-none rounded-xl h-full">
            <CardHeader className="items-start px-6 pt-6 pb-0">
                <div className="w-full flex justify-between items-center">
                    {/* Title Skeleton */}
                    <Skeleton className="h-7 w-40" />
                    {/* Renew Date Badge Skeleton */}
                    <Skeleton className="h-8 w-44 rounded-full" />
                </div>
                {/* Date Description Skeleton */}
                <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center p-0 relative min-h-45">
                {/* The Donut Circle Skeleton */}
                <div className="relative flex items-center justify-center">
                    {/* Outer Ring approximation */}
                    <Skeleton className="h-37.5 w-37.5 rounded-full border-15 border-muted/20 bg-transparent" />

                    {/* Center Text Skeletons */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                        <Skeleton className="h-10 w-12" /> {/* The Number */}
                        <Skeleton className="h-3 w-16" />  {/* "Days Left" text */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}