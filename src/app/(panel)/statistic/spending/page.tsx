"use client"

import React, { useState } from 'react'
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts'
import {
    HiOutlineWallet, HiOutlineTag,
    HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown
} from "react-icons/hi2"

// Mock Data
const dataByWallet = [
    { name: 'Main Bank', value: 5000000, color: '#6366f1' },
    { name: 'Digital Pay', value: 2500000, color: '#ec4899' },
    { name: 'Cash', value: 1200000, color: '#f59e0b' },
]

const dataByCategory = [
    { name: 'Food', value: 3000000, color: '#f43f5e' },
    { name: 'Transport', value: 1200000, color: '#3b82f6' },
    { name: 'Subscripton', value: 800000, color: '#8b5cf6' },
    { name: 'Shopping', value: 2000000, color: '#10b981' },
    { name: 'Investment', value: 1700000, color: '#f59e0b' },
]

export default function SpendingPage() {
    const [activeTab, setActiveTab] = useState<'wallet' | 'category'>('wallet')
    const [timeRange, setTimeRange] = useState('7D')

    return (
        <div className="space-y-8 pb-10">
            {/* Header & Global Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold">Spending Analysis</h2>
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
                    <div className="h-87.5 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={activeTab === 'wallet' ? dataByWallet : dataByCategory}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {(activeTab === 'wallet' ? dataByWallet : dataByCategory).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
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
                            {(activeTab === 'wallet' ? dataByWallet : dataByCategory).slice(0, 5).map((item, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-slate-700 group-hover:text-indigo-500 transition-colors">0{i + 1}</span>
                                        <span className="font-medium text-slate-300">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-white">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.value)}
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
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-slate-700">01</span>
                                    <span className="font-medium text-slate-300">Salary / Project</span>
                                </div>
                                <span className="font-bold text-emerald-400">Rp 15.000.000</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-slate-700">02</span>
                                    <span className="font-medium text-slate-300">Dividends</span>
                                </div>
                                <span className="font-bold text-emerald-400">Rp 1.250.000</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}