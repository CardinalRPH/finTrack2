"use client"

export const RecordSkeleton = () => {
    return (
        <div className="pb-24 animate-pulse">
            <div className="space-y-6">
                {/* Header & Filters Skeleton */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-9 w-12 bg-slate-800 rounded-xl" />
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-full lg:w-64 bg-slate-800 rounded-xl" />
                        <div className="h-10 w-10 bg-slate-800 rounded-xl" />
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-slate-900/20 border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    {[...Array(4)].map((_, i) => (
                                        <th key={i} className="px-6 py-4">
                                            <div className="h-3 w-16 bg-slate-800 rounded" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {[...Array(8)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-24 bg-slate-800 rounded" />
                                                    <div className="h-3 w-16 bg-slate-800 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-20 bg-slate-800 rounded" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-32 bg-slate-800 rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="h-5 w-28 bg-slate-800 rounded" />
                                                <div className="h-3 w-12 bg-slate-800 rounded" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                        <div className="h-4 w-40 bg-slate-800 rounded" />
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-8 w-8 bg-slate-800 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FAB Skeleton */}
            <div className="fixed bottom-8 right-8 w-16 h-16 bg-slate-800 rounded-full" />
        </div>
    );
};