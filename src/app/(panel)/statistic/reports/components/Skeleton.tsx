"use client"

export const ReportsSkeleton = () => {
    return (
        <div className="space-y-8 pb-16 animate-pulse">
            {/* Header & Export Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-800 rounded-lg" />
                    <div className="h-4 w-64 bg-slate-800/50 rounded-md" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-8 w-12 bg-slate-800 rounded-lg" />
                        ))}
                    </div>
                    <div className="h-10 w-24 bg-slate-800 rounded-xl" />
                </div>
            </div>

            {/* 1. Quick Review Table Skeleton */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <div className="h-6 w-32 bg-slate-800 rounded-md" />
                </div>
                <div className="w-full">
                    {/* Table Header Skeleton */}
                    <div className="grid grid-cols-3 px-8 py-4 bg-slate-950/30 border-b border-slate-800">
                        <div className="h-3 w-20 bg-slate-800 rounded" />
                        <div className="h-3 w-20 bg-slate-800 rounded" />
                        <div className="h-3 w-20 bg-slate-800 rounded" />
                    </div>
                    {/* Table Body Skeleton */}
                    <div className="divide-y divide-slate-800/50">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="grid grid-cols-3 px-8 py-5">
                                <div className="h-4 w-32 bg-slate-800 rounded" />
                                <div className="h-4 w-24 bg-slate-800/60 rounded" />
                                <div className="h-4 w-24 bg-slate-800/60 rounded" />
                            </div>
                        ))}
                        {/* Total Row Skeleton */}
                        <div className="grid grid-cols-3 px-8 py-6 bg-slate-950/50">
                            <div className="h-5 w-28 bg-slate-800 rounded" />
                            <div className="h-7 w-36 bg-slate-800 rounded" />
                            <div className="h-7 w-36 bg-slate-800 rounded" />
                        </div>
                    </div>
                </div>
                {/* Banner Skeleton */}
                <div className="bg-indigo-900/40 p-6 flex justify-between items-center">
                    <div className="h-4 w-40 bg-indigo-500/30 rounded" />
                    <div className="h-8 w-48 bg-indigo-500/30 rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2 & 3. Breakdown Skeletons (Wallet & Category) */}
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                            <div className="h-5 w-5 bg-slate-800 rounded" />
                            <div className="h-5 w-32 bg-slate-800 rounded" />
                        </div>
                        <div className="p-2">
                            {[...Array(4)].map((_, j) => (
                                <div key={j} className="flex justify-between px-6 py-4">
                                    <div className="h-4 w-24 bg-slate-800 rounded" />
                                    <div className="h-4 w-20 bg-slate-800/60 rounded" />
                                    <div className="h-4 w-20 bg-slate-800/60 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};