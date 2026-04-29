import { ReactNode } from "react";

export function BudgetStatCard({ title, amount, icon, color, percentage }: {
    title: string,
    amount: string,
    icon: ReactNode,
    color: string,
    percentage?: number
}) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-4xl hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
                    {icon}
                </div>
                {percentage && (
                    <span className="text-[10px] font-bold bg-slate-950 px-2.5 py-1 rounded-full text-slate-400 border border-slate-800">
                        {percentage}% used
                    </span>
                )}
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-white">{amount}</h3>
        </div>
    );
}

