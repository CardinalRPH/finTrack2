"use client"

import React from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line
} from 'recharts'
import {
    HiArrowUpRight, HiArrowDownLeft, HiOutlineWallet,
    HiOutlineCube, HiOutlineClock
} from "react-icons/hi2"

// Mock Data - In a real app, this comes from your tRPC/API query
const trendData = [
    { date: '1 Apr', income: 5000000, outcome: 3200000, balance: 1800000, gold: 10.2 },
    { date: '8 Apr', income: 0, outcome: 1500000, balance: 300000, gold: 10.5 },
    { date: '15 Apr', income: 2000000, outcome: 800000, balance: 1500000, gold: 11.0 },
    { date: '22 Apr', income: 1000000, outcome: 2500000, balance: 0, gold: 10.8 },
    { date: '30 Apr', income: 7000000, outcome: 1200000, balance: 5800000, gold: 12.5 },
]

const lastTransactions = [
    { id: 1, desc: 'Indomaret Coffee', amount: -25000, category: 'Food', icon: '🍔', date: '2 hours ago' },
    { id: 2, desc: 'Salary Bonus', amount: 2000000, category: 'Work', icon: '💰', date: 'Yesterday' },
    { id: 3, desc: 'Buy 1g Antam', amount: -1250000, category: 'Gold', icon: '✨', date: '2 days ago' },
    { id: 4, desc: 'Gopay Topup', amount: -100000, category: 'Transfer', icon: '📱', date: '3 days ago' },
    { id: 5, desc: 'Dinner', amount: -150000, category: 'Food', icon: '🍕', date: '4 days ago' },
]

export default function Dashboard() {
    return (
        <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-50">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Balance" value="Rp 12.450.000" trend="+12%" icon={<HiOutlineWallet />} color="indigo" />
                <StatCard title="Total Gold" value="12.500 gr" trend="+0.5g" icon={<HiOutlineCube />} color="yellow" />
                <StatCard title="Monthly Income" value="Rp 15.000.000" trend="+5%" icon={<HiArrowUpRight />} color="emerald" />
                <StatCard title="Monthly Outcome" value="Rp 8.200.000" trend="-2%" icon={<HiArrowDownLeft />} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trend Graph (Income vs Outcome) */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                    <h3 className="text-lg font-bold mb-6">Cashflow Trend (30 Days)</h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
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

                {/* Gold Investment Trend */}
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                    <h3 className="text-lg font-bold mb-6 text-yellow-500">Gold Accumulation (gr)</h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="date" hide />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                <Line type="stepAfter" dataKey="gold" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308' }} />
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
                        {lastTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-800/50 rounded-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl">{tx.icon}</div>
                                    <div>
                                        <p className="font-medium">{tx.desc}</p>
                                        <p className="text-xs text-slate-500">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('id-ID')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Balance Trend (Net Worth) */}
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                    <h3 className="text-lg font-bold mb-6">Net Balance Trend</h3>
                    <div className="h-62.5 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
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
    )
}

function StatCard({ title, value, trend, icon, color }: any) {
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