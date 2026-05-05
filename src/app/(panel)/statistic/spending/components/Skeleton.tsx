"use client"

export const SpendingSkeleton = () => {
    return (
        <div className="space-y-8 pb-10 animate-pulse">
            {/* Header & Global Filter Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="h-8 w-48 bg-slate-800 rounded-lg" />
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 w-12 bg-slate-800 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Tabs Navigation Skeleton */}
            <div className="flex border-b border-slate-800">
                <div className="w-32 h-12 border-b-2 border-slate-800 mx-4" />
                <div className="w-32 h-12 border-b-2 border-slate-800" />
            </div>

            {/* Content Area Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Side: Pie Chart Card Skeleton */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col">
                    <div className="h-6 w-48 bg-slate-800 rounded mb-8" />
                    <div className="flex-1 flex items-center justify-center py-10">
                        {/* Mockup Pie Chart Circle */}
                        <div className="w-64 h-64 rounded-full border-20 border-slate-800 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-slate-900 shadow-inner" />
                        </div>
                    </div>
                    {/* Mockup Legend */}
                    <div className="flex justify-center gap-4 mt-4">
                        <div className="h-3 w-16 bg-slate-800 rounded-full" />
                        <div className="h-3 w-16 bg-slate-800 rounded-full" />
                        <div className="h-3 w-16 bg-slate-800 rounded-full" />
                    </div>
                </div>

                {/* Right Side: Top 5 Lists Skeleton */}
                <div className="space-y-6">
                    {/* Top 5 Expense & Income Card Skeleton */}
                    {[...Array(2)].map((_, cardIdx) => (
                        <div key={cardIdx} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-5 h-5 bg-slate-800 rounded" />
                                <div className="h-5 w-32 bg-slate-800 rounded" />
                            </div>
                            <div className="space-y-5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-3 bg-slate-800/50 rounded" />
                                            <div className="h-4 w-28 bg-slate-800 rounded" />
                                        </div>
                                        <div className="h-4 w-24 bg-slate-800 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}