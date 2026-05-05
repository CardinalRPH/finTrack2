"use client"

export const DashboardSkeleton = () => {
    return (
        <div className="p-6 space-y-8 bg-slate-950 min-h-screen">
            {/* Header Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Main Graphs Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <GraphSkeleton title="Cashflow Trend" />
                </div>
                <div>
                    <GraphSkeleton title="Invest Accumulation" />
                </div>
            </div>

            {/* Bottom Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TransactionListSkeleton />
                <GraphSkeleton title="Net Balance Trend" />
            </div>
        </div>
    );
};

const StatCardSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
            <div className="w-12 h-6 bg-slate-800 rounded-lg" />
        </div>
        <div className="w-24 h-4 bg-slate-800 rounded mb-2" />
        <div className="w-32 h-8 bg-slate-800 rounded" />
    </div>
);

const GraphSkeleton = ({ title }: { title: string }) => (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl animate-pulse">
        <div className="w-48 h-6 bg-slate-800 rounded mb-6" />
        <div className="w-full h-75 bg-slate-800/50 rounded-2xl flex items-end p-4 gap-2">
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="flex-1 bg-slate-800 rounded-t"
                    style={{ height: `${Math.random() * 60 + 20}%` }}
                />
            ))}
        </div>
    </div>
);

const TransactionListSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl animate-pulse">
        <div className="flex justify-between items-center mb-6">
            <div className="w-40 h-6 bg-slate-800 rounded" />
            <div className="w-16 h-4 bg-slate-800 rounded" />
        </div>
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl" />
                        <div className="space-y-2">
                            <div className="w-32 h-4 bg-slate-800 rounded" />
                            <div className="w-24 h-3 bg-slate-800 rounded opacity-50" />
                        </div>
                    </div>
                    <div className="w-20 h-5 bg-slate-800 rounded" />
                </div>
            ))}
        </div>
    </div>
);