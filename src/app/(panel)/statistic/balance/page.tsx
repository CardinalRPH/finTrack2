"use client"

import React, { useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, Line, ComposedChart
} from 'recharts'
import {
    HiOutlineWallet, HiOutlineArrowTrendingUp,
    HiOutlineArrowTrendingDown, HiOutlineBanknotes,
    HiOutlineCreditCard, HiOutlineDevicePhoneMobile
} from "react-icons/hi2"

// Mock data for trends
const trendData = [
    { name: 'Mon', income: 400000, outcome: 240000, balance: 160000 },
    { name: 'Tue', income: 300000, outcome: 139800, balance: 320200 },
    { name: 'Wed', income: 200000, outcome: 980000, balance: -459800 },
    { name: 'Thu', income: 278000, outcome: 390800, balance: -572600 },
    { name: 'Fri', income: 189000, outcome: 480000, balance: -863600 },
    { name: 'Sat', income: 239000, outcome: 380000, balance: -1004600 },
    { name: 'Sun', income: 349000, outcome: 430000, balance: -1085600 },
]

const walletSummary = [
    { type: 'CARD', name: 'Main Bank', balance: 15200000, color: '#6366f1', icon: HiOutlineCreditCard },
    { type: 'E-WALLET', name: 'Digital Pay', balance: 2450000, color: '#ec4899', icon: HiOutlineDevicePhoneMobile },
    { type: 'CASH', name: 'Physical Cash', balance: 850000, color: '#f59e0b', icon: HiOutlineBanknotes },
]

export default function BalanceStatisticPage() {
    const [timeRange, setTimeRange] = useState('7D')

    return (
        <div className="space-y-8 pb-10">
            {/* 1. Filter Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
                <h2 className="text-xl font-bold px-2">Balance Analytics</h2>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
                    {['7D', '30D', '12W', '6M', '1Y'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Main Chart Section */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                <div className="mb-8">
                    <h3 className="text-lg font-bold">Income vs Outcome Trend</h3>
                    <p className="text-sm text-slate-500">Visualization of your cash flow across all accounts</p>
                </div>

                <div className="h-87.5 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={trendData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '12px' }}
                                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            />
                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Income" />
                            <Bar dataKey="outcome" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} name="Outcome" />
                            <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={false} name="Net Trend" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Account Breakdown List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                    <h3 className="text-lg font-bold mb-6">Balance by Account</h3>
                    <div className="space-y-4">
                        {walletSummary.map((wallet) => (
                            <div key={wallet.name} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 group hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 group-hover:scale-110 transition-transform" style={{ color: wallet.color }}>
                                        <wallet.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold">{wallet.name}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest">{wallet.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(wallet.balance)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Quick Stats Sidebar */}
                <div className="space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-500 rounded-lg text-slate-950"><HiOutlineArrowTrendingUp size={20} /></div>
                            <p className="text-xs font-black uppercase text-emerald-500 tracking-widest">Top Income</p>
                        </div>
                        <p className="text-2xl font-black text-emerald-400">Rp 12.450.000</p>
                        <p className="text-xs text-emerald-500/60 mt-1">Highest this period</p>
                    </div>

                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-rose-500 rounded-lg text-slate-950"><HiOutlineArrowTrendingDown size={20} /></div>
                            <p className="text-xs font-black uppercase text-rose-500 tracking-widest">Top Spending</p>
                        </div>
                        <p className="text-2xl font-black text-rose-400">Rp 8.120.000</p>
                        <p className="text-xs text-rose-500/60 mt-1">Food & Lifestyle focus</p>
                    </div>
                </div>
            </div>
        </div>
    )
}