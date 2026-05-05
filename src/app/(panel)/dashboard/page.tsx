"use client"

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, LineChart, Line
} from 'recharts'
import {
    HiArrowUpRight, HiArrowDownLeft, HiOutlineWallet,
    HiOutlineCube, HiOutlineClock
} from "react-icons/hi2"
import { useGetDashboard } from '@/hooks/dashboardHook'
import { ReactNode, useEffect, useState } from 'react'
import ErrorModal from '../components/ErrorModal'
import { formatToRupiah } from '@/utils/fomatCurrency'
import { IconRenderer } from '@/app/components/IconRenderer'
import StatCard from './components/StatCard'
import { DashboardSkeleton } from './components/Skeleton'

export default function Dashboard() {
    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetDashboard()
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const [isErrMdOpen, setErrMdOpen] = useState(false)

    useEffect(() => {
        if (getErr) {
            setErrMdOpen(getErr)
            setErrMsg(getErrMsg.message)
        }
    }, [getErr])

    if (isLoading) return <DashboardSkeleton />

    return (
        <div>
            <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-50">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Balance" value={formatToRupiah(data?.data.totalBalance)} trend={`${data && data.data.trendsSumary.totalBalance >= 0 ? "+" : "-"}${data?.data.trendsSumary.totalBalance.toString()}%`} icon={<HiOutlineWallet />} color="indigo" />
                    <StatCard title="Total Invest" value={formatToRupiah(data?.data.totalInvest)} trend={`${data && data.data.trendsSumary.totalInvest >= 0 ? "+" : "-"}${data?.data.trendsSumary.totalInvest.toString()}%`} icon={<HiOutlineCube />} color="yellow" />
                    <StatCard title="Monthly Income" value={formatToRupiah(data?.data.monthlyIncome)} trend={`${data && data.data.trendsSumary.monthlyIncome >= 0 ? "+" : "-"}${data?.data.trendsSumary.monthlyIncome.toString()}%`} icon={<HiArrowUpRight />} color="emerald" />
                    <StatCard title="Monthly Outcome" value={formatToRupiah(data?.data.monthlyOutcome)} trend={`${data && data.data.trendsSumary.monthlyOutcome >= 0 ? "+" : "-"}${data?.data.trendsSumary.monthlyOutcome.toString()}%`} icon={<HiArrowDownLeft />} color="rose" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Trend Graph (Income vs Outcome) */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                        <h3 className="text-lg font-bold mb-6">Cashflow Trend (30 Days)</h3>
                        <div className="h-75 w-full flex-1">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={data?.data.trendData.cashFlow}>
                                    <defs>
                                        <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                                        <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp ${v / 1000000}M`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="outcome" stroke="#f43f5e" fillOpacity={1} fill="url(#colorOut)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/*  Investment Trend */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                        <h3 className="text-lg font-bold mb-6 text-yellow-500">Invest Accumulation</h3>
                        <div className="h-75 w-full flex-1">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data?.data.trendData.investYear}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="date" hide />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Line type="stepAfter" dataKey="amount" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Last 5 Transactions */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <HiOutlineClock className="text-indigo-400" /> Recent Transactions
                            </h3>
                            <button className="text-sm text-indigo-400 hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {data?.data.recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-2xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl" style={{ color: tx.category?.color }}>
                                            <IconRenderer iconName={tx.category!.icon} className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{tx.description}</p>
                                            <p className="text-xs text-slate-500">{tx.category?.name} • {new Date(tx.date).toDateString()}</p>
                                        </div>
                                    </div>
                                    <p className={`font-bold ${Number(tx.amount) > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                                        {Number(tx.amount) > 0 ? '+' : ''}{Number(tx.amount).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Balance Trend (Net Worth) */}
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                        <h3 className="text-lg font-bold mb-6">Net Balance Trend</h3>
                        <div className="h-62.5 w-full flex-1">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data?.data.trendData.netWorth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Bar dataKey="balance" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    )
}