"use client"

import { useState } from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts'
import {
    HiOutlineScale,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePlus
} from "react-icons/hi2"
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from "react-icons/hi";
import { GiGoldBar } from "react-icons/gi"
import { AnimatePresence } from 'framer-motion'
import GoldRecordModal from './components/GoldRecordModal'
import { formatToRupiah } from '@/utils/fomatCurrency';

// Mock Data for the Price Chart
const goldPriceHistory = [
    { date: '13 Apr', price: 1210000 },
    { date: '14 Apr', price: 1215000 },
    { date: '15 Apr', price: 1208000 },
    { date: '16 Apr', price: 1225000 },
    { date: '17 Apr', price: 1230000 },
    { date: '18 Apr', price: 1245000 },
    { date: '19 Apr', price: 1240000 },
]

export default function InvestmentPage() {
    const [timeRange, setTimeRange] = useState('7D')
    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<any>(null)

    const handleOpenAdd = () => {
        setSelectedRecord(null)
        setModalOpen(true)
    }

    const handleEdit = (record: any) => {
        setSelectedRecord(record)
        setModalOpen(true)
    }


    // Portfolio Summary (Mock)
    const currentPricePerGram = 1240000
    const avgPurchasePrice = 1150000
    const totalGrams = 12.5
    const currentValuation = totalGrams * currentPricePerGram
    const totalInvestment = totalGrams * avgPurchasePrice
    const profitLoss = currentValuation - totalInvestment
    const profitPercentage = (profitLoss / totalInvestment) * 100

    return (
        <div>
            <div className="space-y-8 pb-20">
                {/* 1. Header & Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-amber-500/10"><GiGoldBar size={120} /></div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Gold Balance</p>
                        <h3 className="text-3xl font-black text-white mb-1">{totalGrams} <span className="text-sm font-medium text-slate-500">gram</span></h3>
                        <p className="text-xl font-bold text-indigo-400">
                            {formatToRupiah(currentValuation)}
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <HiOutlineScale className="text-slate-500" />
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg. Buy Price</p>
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(avgPurchasePrice)}
                            <span className="text-xs text-slate-500 ml-2">/ gram</span>
                        </h3>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            {profitLoss >= 0 ? <HiOutlineTrendingUp className="text-emerald-500" /> : <HiOutlineTrendingDown className="text-rose-500" />}
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Profit / Loss</p>
                        </div>
                        <h3 className={`text-2xl font-black ${profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {profitLoss >= 0 ? '+' : ''}
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(profitLoss)}
                        </h3>
                        <p className={`text-sm font-bold ${profitLoss >= 0 ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
                            {profitLoss >= 0 ? '▲' : '▼'} {profitPercentage.toFixed(2)}%
                        </p>
                    </div>
                </div>

                {/* 2. Gold Price Chart */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">Gold Market Price</h3>
                            <p className="text-sm text-slate-500">Live price tracking for 1 gram (Antam/Global)</p>
                        </div>
                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
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

                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={goldPriceHistory}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Recent Transactions List */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 border-b border-slate-800">
                        <h3 className="text-lg font-bold">Recent Purchases</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Price /g</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Total Paid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {[1, 2].map((i) => (
                                    <tr key={i} className="group hover:bg-slate-800/20 transition-colors">
                                        <td className="px-8 py-5 text-sm text-slate-300">1{i} Apr 2026</td>
                                        <td className="px-8 py-5 font-bold text-white">1.0 g</td>
                                        <td className="px-8 py-5 text-sm text-slate-400">Rp 1.240.000</td>
                                        <td className="px-8 py-5 text-right font-bold text-indigo-400">
                                            <div className="flex items-center justify-end gap-4">
                                                <span>Rp 1.240.000</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit({ id: i, amount: 1, price: 1240000 })} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                                                        <HiOutlinePencil size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500">
                                                        <HiOutlineTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <button
                onClick={handleOpenAdd}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl shadow-2xl shadow-amber-500/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
                <HiOutlinePlus className="w-8 h-8 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
            </button>
            <AnimatePresence>
                {isModalOpen && (
                    <GoldRecordModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        initialData={selectedRecord}
                        onSave={(data) => console.log("Gold Record:", data)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}