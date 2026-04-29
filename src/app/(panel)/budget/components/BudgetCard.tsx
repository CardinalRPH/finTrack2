import { motion } from "framer-motion";
import { HiOutlineDotsVertical } from "react-icons/hi";

export function CategoryBudgetCard({ category, limit, spent, color }: {
    category: string,
    limit: number,
    spent: number,
    color: string
}) {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isWarning = percentage >= 85;

    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-lg font-bold text-white mb-1">{category}</h4>
                    <p className="text-slate-500 text-xs font-medium">Monthly spending limit</p>
                </div>
                <button className="text-slate-600 hover:text-white transition-colors">
                    <HiOutlineDotsVertical size={20} />
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Spent</span>
                        <span className={`text-xl font-black ${isWarning ? 'text-rose-500' : 'text-white'}`}>
                            Rp {spent.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Limit</span>
                        <span className="text-sm font-bold text-slate-300">Rp {limit.toLocaleString()}</span>
                    </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                            backgroundColor: isWarning ? '#f43f5e' : color,
                            boxShadow: `0 0 15px ${isWarning ? '#f43f5e' : color}40`
                        }}
                    />
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className={isWarning ? 'text-rose-500' : 'text-slate-500'}>
                        {isWarning ? 'Warning: High Usage' : 'Safe Zone'}
                    </span>
                    <span className="text-slate-400">{percentage.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
}