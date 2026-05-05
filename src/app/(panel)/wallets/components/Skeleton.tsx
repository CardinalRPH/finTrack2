"use client"

export const WalletSkeleton = () => {
    return (
        <div className="space-y-8 pb-20 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-4xl overflow-hidden shadow-xl"
                    >
                        <div className="flex justify-between items-start mb-8">
                            {/* Icon Box Skeleton */}
                            <div className="w-14 h-14 rounded-2xl bg-slate-800" />

                            {/* Action Buttons Skeleton */}
                            <div className="flex gap-2">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg" />
                                <div className="w-8 h-8 bg-slate-800 rounded-lg" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Wallet Name Skeleton */}
                            <div className="h-4 w-24 bg-slate-800 rounded shadow-sm" />
                            {/* Balance Skeleton */}
                            <div className="h-9 w-48 bg-slate-800 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Button Skeleton */}
            <div className="fixed bottom-8 right-8 w-16 h-16 bg-slate-800 rounded-2xl shadow-2xl" />
        </div>
    );
};