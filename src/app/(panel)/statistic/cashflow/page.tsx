"use client"

import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts'
import {
    HiOutlineArrowDownLeft, HiOutlineArrowUpRight,
    HiOutlineScale
} from "react-icons/hi2"
import { getStatisticSchemaType } from '@/server/schemas/statisticSchema'
import { useGetCashFlow } from '@/hooks/statisticHook'
import { formatToRupiah } from '@/utils/fomatCurrency'
import ErrorModal from '../../components/ErrorModal'


export default function CashFlowPage() {
    const ranges = ['7D', '30D', '12W', '6M', '1Y']
    const [timeRange, setTimeRange] = useState<getStatisticSchemaType["range"]>('7D')
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetCashFlow({ filter: { range: timeRange } })

    useEffect(() => {
        if (getErr) {
            setErrMdOpen(getErr)
            setErrMsg(getErrMsg.message)
        }
    }, [getErr])
    return (
        <div className="space-y-8 pb-10">
            {/* 1. Filter & Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Cash Flow Analysis</h2>
                    <p className="text-slate-500 text-sm">Monitor your money movement across all accounts</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {ranges.map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range as getStatisticSchemaType["range"])}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5">
                    <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><HiOutlineArrowDownLeft size={32} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Income</p>
                        <h3 className="text-2xl font-black text-emerald-400">{formatToRupiah(data?.data.totalIncome)}</h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5">
                    <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl"><HiOutlineArrowUpRight size={32} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Expense</p>
                        <h3 className="text-2xl font-black text-rose-400">{formatToRupiah(data?.data.totalOutcome)}</h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5 border-b-4 border-b-indigo-500">
                    <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl"><HiOutlineScale size={32} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Cash Flow</p>
                        <h3 className="text-2xl font-black text-white">{formatToRupiah(data?.data.totalNetworth)}</h3>
                    </div>
                </div>
            </div>

            {/* 3. Main Trend Graph */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                <h3 className="text-lg font-bold mb-8">Cash Flow Trend</h3>
                <div className="h-87.5 w-full flex-1">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data?.data.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            />
                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                            <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
                            <Bar dataKey="outcome" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Breakdown by Wallet */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                <h3 className="text-lg font-bold mb-6">Income/Expense by Wallet</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data?.data.walletData.map((w) => (
                        <div key={w.name} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 rounded-full" />
                                <span className="font-bold text-slate-200">{w.name}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Income</span>
                                    <span className="text-emerald-400 font-bold">+{formatToRupiah(w.income)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Expense</span>
                                    <span className="text-rose-400 font-bold">-{formatToRupiah(w.outcome)}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between">
                                    <span className="text-xs text-slate-500 uppercase font-bold">Net</span>
                                    <span className={`font-black ${w.networth >= 0 ? 'text-white' : 'text-rose-500'}`}>
                                        {formatToRupiah(w.networth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    )
}