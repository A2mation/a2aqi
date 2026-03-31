import React from 'react'

const AQIMapLoader = () => {
    return (
        <>
            <div className="relative h-full w-full bg-muted/5 rounded-2xl border border-border/50 overflow-hidden">
                <div className="absolute inset-0 z-10 animate-pulse">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-muted/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>

                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                    <div className="h-5 w-32 bg-muted/20 rounded-md" />
                    <div className="h-3 w-20 bg-muted/10 rounded-sm" />
                </div>

                <div className="absolute top-6 right-6 z-20 flex gap-2">
                    <div className="h-9 w-24 bg-muted/20 rounded-xl" />
                    <div className="h-9 w-9 bg-muted/20 rounded-xl" />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-muted/20 animate-ping opacity-40" />
                    <div className="absolute h-6 w-6 rounded-full bg-muted/30 border border-muted/40 shadow-inner" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="p-4 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 flex items-center gap-4 shadow-xl">
                        <div className="h-10 w-10 rounded-xl bg-muted/20 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-2.5 w-16 bg-muted/20 rounded" />
                            <div className="h-3.5 w-32 bg-muted/10 rounded" />
                        </div>
                        <div className="h-6 w-10 bg-muted/20 rounded-lg shrink-0" />
                    </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 translate-y-12">
                        Syncing Geospatial Data..
                    </span>
                </div>
            </div>
        </>
    )
}

export default AQIMapLoader
