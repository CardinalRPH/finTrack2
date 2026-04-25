"use client"

import { useState, useMemo } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    Legend
} from 'recharts'
import {
    HiOutlinePlus,
    HiOutlineBriefcase,
    HiOutlineChartPie,
    HiOutlineScale,
    HiOutlineCalendar
} from "react-icons/hi2"
import { AnimatePresence } from 'framer-motion'
import { formatToRupiah } from '@/utils/fomatCurrency'
import CreateInvestmentModal from './components/InvestmentModal'

interface Transaction {
    id: string;
    date: string;
    amount: number;
    quantity: number;
}

interface InvestmentCategory {
    id: string;
    assetName: string;
    type: string;
    totalQuantity: number;
    currentPurchasePrice: number;
    transactions: Transaction[]; // Tambahkan ini
}

const mockInvestments: InvestmentCategory[] = [
    {
        id: '1',
        assetName: 'Logam Mulia Antam',
        type: 'GOLD',
        totalQuantity: 10,
        currentPurchasePrice: 1200000,
        transactions: [
            { id: 'tx1', date: '2026-04-20', amount: 1200000, quantity: 1 },
            { id: 'tx2', date: '2026-03-15', amount: 2400000, quantity: 2 },
        ]
    },
    // ... data lainnya
];

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899'];

export default function InvestmentPage() {
    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    // 1. Data Aggregation for Line Chart (Growth by Year)
    const monthlyLineData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return months.map((month, index) => {
            const monthlyValue = mockInvestments.reduce((acc, inv) => {
                // Sekarang TypeScript tahu 'transactions' ada di dalam 'inv'
                const totalMonthlyForAsset = inv.transactions
                    .filter(tx => {
                        const d = new Date(tx.date);
                        return d.getMonth() === index && d.getFullYear() === selectedYear;
                    })
                    .reduce((sum, tx) => sum + tx.amount, 0);
                return acc + totalMonthlyForAsset;
            }, 0);

            return { name: month, value: monthlyValue };
        });
    }, [selectedYear]);

    // 2. Summary Calculations
    const totalValue = useMemo(() =>
        mockInvestments.reduce((acc, inv) => acc + (inv.totalQuantity * inv.currentPurchasePrice), 0)
        , []);

    const chartData = useMemo(() =>
        mockInvestments.map(inv => ({
            name: inv.assetName,
            value: inv.totalQuantity * inv.currentPurchasePrice
        }))
        , []);

    return (
        <div className="space-y-8 pb-24">
            {/* 1. Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-indigo-500/5 rotate-12"><HiOutlineBriefcase size={120} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Portfolio Value</p>
                    <h3 className="text-3xl font-black text-white">{formatToRupiah(totalValue)}</h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Assets</p>
                    <h3 className="text-3xl font-black text-white">{mockInvestments.length} <span className="text-sm font-medium text-slate-600 underline">Categories</span></h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter Year</p>
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 group-hover:scale-110 transition-transform">
                            <HiOutlineCalendar size={18} />
                        </div>
                    </div>

                    <div className="relative mt-4">
                        {/* Year Picker Dropdown */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 text-white text-sm font-bold rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                        >
                            {/* Generate tahun secara dinamis (misal: 5 tahun kebelakang) */}
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <option key={year} value={year}>
                                    Investment Year: {year}
                                </option>
                            ))}
                        </select>

                        {/* Custom Arrow Icon untuk Select */}
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Line Chart: Growth Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div className="bg-slate-900 border  border-slate-800 p-8 rounded-[3rem]">
                    <h3 className="text-xl font-black text-white mb-6">Asset Distribution</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%" cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    formatter={(value: any) => {
                                        if (typeof value === 'number') {
                                            return [formatToRupiah(value), "Market Value"];
                                        }
                                        return [value, "Market Value"];
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem]">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-white">Investment Trend</h3>
                        <p className="text-xs text-slate-500 font-medium">Accumulated purchase value for {selectedYear}</p>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyLineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{payload[0].payload.name} {selectedYear}</p>
                                                    <p className="text-sm font-black text-indigo-400">{formatToRupiah(Number(payload[0].value))}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


            {/* 3. List Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockInvestments.map((inv, index) => (
                    <div key={inv.id} className="bg-slate-900 border border-slate-800 p-6 rounded-4xl flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                <HiOutlineScale size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{inv.assetName}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{inv.type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-white">{formatToRupiah(inv.totalQuantity * inv.currentPurchasePrice)}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{inv.totalQuantity} Units</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Float Add Button */}
            <button
                onClick={() => setModalOpen(true)}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 transition-all active:scale-95 group"
            >
                <HiOutlinePlus size={32} className="group-hover:rotate-90 transition-transform" />
            </button>

            <AnimatePresence>
                {isModalOpen && <CreateInvestmentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />}
            </AnimatePresence>
        </div>
    )
}