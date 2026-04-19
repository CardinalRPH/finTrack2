"use client"

import React, { useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, Cell
} from 'recharts'
import {
    HiOutlineArrowDownLeft, HiOutlineArrowUpRight,
    HiOutlineScale, HiOutlineBanknotes,
    HiOutlineCreditCard, HiOutlineDevicePhoneMobile
} from "react-icons/hi2"

// Mock data pergerakan arus kas
const cashFlowData = [
    { name: 'Mon', income: 1200000, expense: 800000 },
    { name: 'Tue', income: 900000, expense: 1200000 },
    { name: 'Wed', income: 3000000, expense: 500000 },
    { name: 'Thu', income: 1500000, expense: 1800000 },
    { name: 'Fri', income: 800000, expense: 400000 },
    { name: 'Sat', income: 500000, expense: 1200000 },
    { name: 'Sun', income: 2000000, expense: 900000 },
]

// Data Breakdown per Wallet
const walletFlow = [
    { name: 'Main Bank (Card)', income: 8500000, expense: 4200000, color: '#6366f1' },
    { name: 'Digital Pay (E-Wallet)', income: 2100000, expense: 3800000, color: '#ec4899' },
    { name: 'Physical Cash', income: 500000, expense: 1200000, color: '#f59e0b' },
]

export default function CashFlowPage() {
    const [timeRange, setTimeRange] = useState('7D')

    return (
        <div className="space-y-8 pb-10">
            {/* 1. Filter & Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Cash Flow Analysis</h2>
                    <p className="text-slate-500 text-sm">Monitor your money movement across all accounts</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {['7D', '30D', '12W', '6M', '1Y'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
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
                        <h3 className="text-2xl font-black text-emerald-400">Rp 11.100.000</h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5">
                    <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl"><HiOutlineArrowUpRight size={32} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Expense</p>
                        <h3 className="text-2xl font-black text-rose-400">Rp 6.800.000</h3>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-5 border-b-4 border-b-indigo-500">
                    <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl"><HiOutlineScale size={32} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Cash Flow</p>
                        <h3 className="text-2xl font-black text-white">Rp 4.300.000</h3>
                    </div>
                </div>
            </div>

            {/* 3. Main Trend Graph */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                <h3 className="text-lg font-bold mb-8">Cash Flow Trend</h3>
                <div className="h-87.5 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cashFlowData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                                cursor={{ fill: '#1e293b', opacity: 0.4 }}
                            />
                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                            <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Income" />
                            <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Breakdown by Wallet */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
                <h3 className="text-lg font-bold mb-6">Income/Expense by Wallet</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {walletFlow.map((w) => (
                        <div key={w.name} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: w.color }} />
                                <span className="font-bold text-slate-200">{w.name}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Income</span>
                                    <span className="text-emerald-400 font-bold">+{new Intl.NumberFormat('id-ID').format(w.income)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Expense</span>
                                    <span className="text-rose-400 font-bold">-{new Intl.NumberFormat('id-ID').format(w.expense)}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between">
                                    <span className="text-xs text-slate-500 uppercase font-bold">Net</span>
                                    <span className={`font-black ${w.income - w.expense >= 0 ? 'text-white' : 'text-rose-500'}`}>
                                        {new Intl.NumberFormat('id-ID').format(w.income - w.expense)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}