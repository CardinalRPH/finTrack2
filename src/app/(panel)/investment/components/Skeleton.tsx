"use client"

export const InvestmentSkeleton = () => {
    return (
        <div className="space-y-8 pb-24 animate-pulse">
            {/* 1. Header Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] h-32 flex flex-col justify-center">
                        <div className="h-3 w-20 bg-slate-800 rounded mb-3" />
                        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* 2. Charts Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[3rem]">
                        <div className="h-6 w-40 bg-slate-800 rounded-md mb-6" />
                        <div className="h-72 w-full bg-slate-800/30 rounded-2xl flex items-center justify-center">
                            {/* Mockup Chart Circle/Lines */}
                            <div className={`w-40 h-40 rounded-full border-8 border-slate-800 ${i === 1 ? 'hidden' : 'block'}`} />
                            <div className={`w-full px-8 space-y-4 ${i === 0 ? 'hidden' : 'block'}`}>
                                <div className="h-0.5 bg-slate-800 w-full" />
                                <div className="h-0.5 bg-slate-800 w-full" />
                                <div className="h-0.5 bg-slate-800 w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Asset List Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-4xl flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-slate-800 rounded" />
                                <div className="h-3 w-16 bg-slate-800 rounded" />
                            </div>
                        </div>
                        <div className="h-5 w-24 bg-slate-800 rounded" />
                    </div>
                ))}
            </div>

            {/* Float Button Skeleton */}
            <div className="fixed bottom-8 right-8 w-16 h-16 bg-slate-800 rounded-2xl" />
        </div>
    );
};