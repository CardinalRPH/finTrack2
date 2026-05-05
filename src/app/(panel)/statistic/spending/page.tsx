"use client"

import { useEffect, useState } from 'react'
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts'
import {
    HiOutlineWallet, HiOutlineTag,
    HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown
} from "react-icons/hi2"
import { getStatisticSchemaType } from '@/server/schemas/statisticSchema'
import { useGetSpending } from '@/hooks/statisticHook'
import { formatToRupiah } from '@/utils/fomatCurrency'
import ErrorModal from '../../components/ErrorModal'

export default function SpendingPage() {
    const ranges = ['7D', '30D', '12W', '6M', '1Y']
    const [activeTab, setActiveTab] = useState<'wallet' | 'category'>('wallet')
    const [timeRange, setTimeRange] = useState<getStatisticSchemaType["range"]>('7D')
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>(null)

    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetSpending({ filter: { range: timeRange } })

    useEffect(() => {
        if (getErr) {
            setErrMdOpen(getErr)
            setErrMsg(getErrMsg.message)
        }
    }, [getErr])

    return (
        <div className="space-y-8 pb-10">
            {/* Header & Global Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold">Spending Analysis</h2>
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

            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-800">
                <button
                    onClick={() => setActiveTab('wallet')}
                    className={`px-8 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'wallet' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    By Wallet
                </button>
                <button
                    onClick={() => setActiveTab('category')}
                    className={`px-8 py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'category' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    By Category
                </button>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Side: Pie Chart Card */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                        {activeTab === 'wallet' ? <HiOutlineWallet /> : <HiOutlineTag />}
                        {activeTab === 'wallet' ? 'Wallet Distribution' : 'Category Distribution'}
                    </h3>
                    <div className="h-87.5 w-full flex-1">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={activeTab === 'wallet' ? data?.data.byWallet.topExpense : data?.data.byCategory.topExpense}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {data && (activeTab === 'wallet' ? data.data.byWallet.topExpense : data.data.byCategory.topExpense).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Side: Top 5 Lists */}
                <div className="space-y-6">
                    {/* Top 5 Expense */}
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-2 mb-6 text-rose-400">
                            <HiOutlineArrowTrendingDown size={20} />
                            <h3 className="font-bold">{activeTab === "wallet" ? "Top Expenses" : "Top 5 Expenses"}</h3>
                        </div>
                        <div className="space-y-4">
                            {data && (activeTab === 'wallet' ? data?.data.byWallet.topExpense : data?.data.byCategory.topExpense).map((item, i) => (
                                <div key={`income-${i}`} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-slate-700 group-hover:text-indigo-500 transition-colors">0{i + 1}</span>
                                        <span className="font-medium text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-white">
                                        {formatToRupiah(item.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top 5 Income (Mocked) */}
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                        <div className="flex items-center gap-2 mb-6 text-emerald-400">
                            <HiOutlineArrowTrendingUp size={20} />
                            <h3 className="font-bold">Top 5 Incomes</h3>
                        </div>
                        <div className="space-y-4">
                            {/* Example Income List */}
                            {data && (activeTab === "wallet" ? data.data.byWallet.topIncome : data.data.byCategory.topIncome).map((item, index) => (
                                <div key={`outcome-${index}`} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-slate-700">0{index + 1}</span>
                                        <span className="font-medium text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-emerald-400">{formatToRupiah(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    )
}