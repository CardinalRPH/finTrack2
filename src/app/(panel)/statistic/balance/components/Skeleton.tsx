"use client"

export const BalanceStatisticSkeleton = () => {
    return (
        <div className="space-y-8 pb-10 animate-pulse">
            {/* 1. Filter Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
                <div className="h-7 w-48 bg-slate-800 rounded-lg px-2" />
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 w-12 bg-slate-800 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* 2. Main Chart Section Skeleton */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                <div className="mb-8 space-y-2">
                    <div className="h-6 w-56 bg-slate-800 rounded-md" />
                    <div className="h-4 w-80 bg-slate-800/50 rounded-md" />
                </div>

                {/* Mockup Chart Area */}
                <div className="h-87.5 w-full bg-slate-800/20 rounded-2xl flex items-end justify-between px-6 pb-4 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex gap-1 items-end h-full">
                            <div className="w-4 bg-slate-800 rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }} />
                            <div className="w-4 bg-slate-800/40 rounded-t" style={{ height: `${Math.random() * 40 + 10}%` }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Bottom Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Account Breakdown List */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                    <div className="h-6 w-48 bg-slate-800 rounded-md mb-6" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-slate-800 rounded" />
                                        <div className="h-3 w-16 bg-slate-800 rounded" />
                                    </div>
                                </div>
                                <div className="h-6 w-28 bg-slate-800 rounded-lg" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-slate-800/10 border border-slate-800/20 p-6 rounded-[2.5rem]">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-slate-800 rounded-lg" />
                                <div className="h-3 w-24 bg-slate-800 rounded" />
                            </div>
                            <div className="h-8 w-40 bg-slate-800 rounded-lg mb-2" />
                            <div className="h-3 w-32 bg-slate-800/50 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}