import { ReactNode } from "react"

const StatCard = ({ title, value, trend, icon, color }: {
    title: string,
    value: string | number,
    trend: string,
    icon: ReactNode,
    color: string

}) => {
    const colorMap: any = {
        indigo: 'text-indigo-400 bg-indigo-400/10',
        yellow: 'text-yellow-500 bg-yellow-500/10',
        emerald: 'text-emerald-400 bg-emerald-400/10',
        rose: 'text-rose-400 bg-rose-400/10',
    }

    return (
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorMap[color]}`}>{icon}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
    )
}

export default StatCard