"use client"
export const CashFlowSkeleton = () => {
    return (
        <div className="space-y-8 pb-10 animate-pulse">
            {/* 1. Filter & Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-800 rounded-lg" />
                    <div className="h-4 w-80 bg-slate-800/50 rounded-md" />
                </div>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 w-12 bg-slate-800 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* 2. Top Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl" />
                        <div className="space-y-3">
                            <div className="h-3 w-24 bg-slate-800 rounded" />
                            <div className="h-7 w-32 bg-slate-800 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Main Trend Graph Skeleton */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                <div className="h-6 w-48 bg-slate-800 rounded mb-8" />
                <div className="h-87.5 w-full bg-slate-800/20 rounded-2xl flex items-end justify-around px-10 pb-6">
                    {/* Mockup Bars */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-2 items-end">
                            <div className="w-8 bg-slate-800 rounded-t-lg" style={{ height: '60%' }} />
                            <div className="w-8 bg-slate-800/40 rounded-t-lg" style={{ height: '40%' }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Breakdown by Wallet Skeleton */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                <div className="h-6 w-56 bg-slate-800 rounded mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-slate-800 rounded-full" />
                                <div className="h-5 w-24 bg-slate-800 rounded" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-4 w-16 bg-slate-800 rounded" />
                                    <div className="h-4 w-20 bg-emerald-500/20 rounded" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-16 bg-slate-800 rounded" />
                                    <div className="h-4 w-20 bg-rose-500/20 rounded" />
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between">
                                    <div className="h-3 w-10 bg-slate-800 rounded" />
                                    <div className="h-5 w-24 bg-slate-800 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
