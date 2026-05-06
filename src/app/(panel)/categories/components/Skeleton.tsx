// components/skeletons/CategorySkeleton.tsx
export const CategorySkeleton = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
                {/* Skeleton Icon */}
                <div className="w-12 h-12 rounded-2xl bg-slate-800" />

                {/* Skeleton Text */}
                <div className="h-5 w-24 bg-slate-800 rounded-lg" />
            </div>

            {/* Skeleton Action Buttons */}
            <div className="flex gap-2">
                <div className="w-8 h-8 bg-slate-800 rounded-xl" />
                <div className="w-8 h-8 bg-slate-800 rounded-xl" />
            </div>
        </div>
    )
}