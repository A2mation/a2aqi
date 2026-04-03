import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function HourlyAnalysisSkeleton() {
    return (
        <div className="w-full mx-auto p-6 rounded-2xl bg-white border shadow-sm">
            {/* Header Skeleton */}
            <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-8 w-48" /> {/* Title */}
                <Skeleton className="h-10 w-44" /> {/* Date Picker Button */}
            </div>

            <div className="space-y-6">
                {/* Heatmap Grid Skeleton */}
                <div className="border border-gray-100 rounded-xl p-2 sm:p-4">
                    <div
                        className="grid gap-1 w-full"
                        style={{
                            // Mirroring your exact grid logic
                            gridTemplateColumns: `clamp(60px, 16vw, 90px) repeat(7, 1fr)`,
                        }}
                    >
                        {/* Header row (Dates) */}
                        <div />
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={`date-skele-${i}`} className="flex justify-center pb-2">
                                <Skeleton className="h-4 w-8 sm:w-12" />
                            </div>
                        ))}

                        {/* Time Slot Rows (24 slots) */}
                        {Array.from({ length: 24 }).map((_, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="contents">
                                {/* Time Label */}
                                <div className="pr-3 flex items-center justify-end">
                                    <Skeleton className="h-3 w-10 sm:w-14" />
                                </div>
                                {/* 7 Day Blocks */}
                                {Array.from({ length: 7 }).map((_, colIndex) => (
                                    <Skeleton
                                        key={`block-${rowIndex}-${colIndex}`}
                                        className="rounded-sm"
                                        style={{ height: "clamp(16px, 3vw, 26px)", width: "100%" }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Stat Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-slate-50 border-none shadow-none space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-8 w-20" />
                    </Card>
                    <Card className="p-4 bg-slate-50 border-none shadow-none space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-8 w-20" />
                    </Card>
                </div>
            </div>
        </div>
    );
}