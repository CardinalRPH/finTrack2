"use client"

export const BudgetSkeleton = () => {
    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 pb-24">
            {/* HEADER SECTION SKELETON */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-pulse">
                <div>
                    <div className="h-10 w-48 bg-slate-900 rounded-lg mb-3" />
                    <div className="h-4 w-64 bg-slate-900 rounded-md" />
                </div>
                <div className="h-12 w-40 bg-slate-900 rounded-2xl" />
            </header>

            {/* STATS OVERVIEW SKELETON */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[...Array(3)].map((_, i) => (
                    <BudgetStatCardSkeleton key={i} />
                ))}
            </div>

            {/* BUDGET LIST GRID SKELETON */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <CategoryBudgetCardSkeleton key={i} />
                ))}
            </section>
        </div>
    );
};

const BudgetStatCardSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-4xl animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 bg-slate-800 rounded-2xl" />
            <div className="w-16 h-6 bg-slate-800 rounded-full" />
        </div>
        <div className="w-24 h-3 bg-slate-800 rounded mb-2" />
        <div className="w-40 h-8 bg-slate-800 rounded-lg" />
    </div>
);

const CategoryBudgetCardSkeleton = () => (
    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] animate-pulse">
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="w-32 h-6 bg-slate-800 rounded-md mb-2" />
                <div className="w-24 h-3 bg-slate-800 rounded-sm opacity-50" />
            </div>
            <div className="w-5 h-5 bg-slate-800 rounded-full" />
        </div>

        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <div className="w-10 h-2 bg-slate-800 rounded" />
                    <div className="w-32 h-7 bg-slate-800 rounded-lg" />
                </div>
                <div className="space-y-2 flex flex-col items-end">
                    <div className="w-10 h-2 bg-slate-800 rounded" />
                    <div className="w-24 h-5 bg-slate-800 rounded-md opacity-70" />
                </div>
            </div>

            {/* PROGRESS BAR SKELETON */}
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800" />

            <div className="flex justify-between">
                <div className="w-20 h-2 bg-slate-800 rounded" />
                <div className="w-8 h-2 bg-slate-800 rounded" />
            </div>
        </div>
    </div>
);