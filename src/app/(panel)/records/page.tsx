"use client"

import { IconRenderer } from '@/app/components/IconRenderer'
import { useState } from 'react'
import {
    HiOutlineAdjustmentsHorizontal,
    HiOutlineArrowUpCircle, HiOutlineArrowDownCircle,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlinePlus
} from "react-icons/hi2"
import { HiOutlineSearch } from "react-icons/hi";
import { AnimatePresence } from 'framer-motion';
import RecordModal from './components/RecordModal';

// Types for our records
interface Transaction {
    id: string
    type: 'INCOME' | 'EXPENSE'
    amount: number
    category: {
        name: string
        icon: string
        color: string
    }
    date: string
    note: string
}

const mockTransactions: Transaction[] = [
    { id: '1', type: 'EXPENSE', amount: 45000, category: { name: 'Food', icon: 'HiOutlineShoppingCart', color: '#fb7185' }, date: '2026-04-19', note: 'Dinner at Mall' },
    { id: '2', type: 'INCOME', amount: 5000000, category: { name: 'Salary', icon: 'HiOutlineWallet', color: '#34d399' }, date: '2026-04-18', note: 'Monthly Pay' },
    { id: '3', type: 'EXPENSE', amount: 1200000, category: { name: 'Investment', icon: 'GiGoldBar', color: '#fbbf24' }, date: '2026-04-15', note: 'Buy 1g Gold' },
]

export default function RecordsPage() {
    const [timeRange, setTimeRange] = useState('7D')
    const ranges = ['7D', '30D', '12W', '6M', '1Y']
    const [records, setRecords] = useState(mockTransactions)
    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<any>(null)
    const [editingRecord, setEditingRecord] = useState<Transaction | null>(null)

    const handleOpenAdd = () => {
        setSelectedRecord(null) // Reset for new record
        setModalOpen(true)
    }

    const handleOpenEdit = (record: any) => {
        setSelectedRecord(record) // Load data for edit
        setModalOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Delete this transaction? This cannot be undone.")) {
            setRecords(records.filter(r => r.id !== id))
        }
    }

    const handleSave = (data: any) => {
        if (selectedRecord) {
            console.log("Updating existing record:", data)
        } else {
            console.log("Saving new record:", data)
        }
        // Here you would call your tRPC mutation or API
    }

    return (
        <div>
            <div className="space-y-6">
                {/* Filters & Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {ranges.map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${timeRange === range
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 lg:w-64">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white">
                            <HiOutlineAdjustmentsHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-slate-900/20 border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Note</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {records.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="p-2 rounded-xl bg-slate-800 border border-slate-700 transition-transform group-hover:scale-110"
                                                    style={{ color: tx.category.color }}
                                                >
                                                    <IconRenderer iconName={tx.category.icon} className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-slate-200">{tx.category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                                            {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 italic max-w-50 truncate">
                                            {tx.note || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`font-bold text-lg ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {tx.type === 'INCOME' ? '+' : '-'}
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(tx.amount)}
                                                </span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {tx.type === 'INCOME' ? (
                                                        <HiOutlineArrowUpCircle className="text-emerald-500/50 w-3 h-3" />
                                                    ) : (
                                                        <HiOutlineArrowDownCircle className="text-rose-500/50 w-3   h-3" />
                                                    )}
                                                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">{tx.type}</span>
                                                </div>
                                                {/* Action Buttons (Hover Only) */}
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleOpenEdit(tx)}
                                                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                                                    >
                                                        <HiOutlinePencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tx.id)}
                                                        className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500"
                                                    >
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
            {/* Floating Action Button */}
            <button
                onClick={handleOpenAdd}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            >
                <HiOutlinePlus className="w-8 h-8 transition-transform group-hover:rotate-90" />

                {/* Optional: Tooltip for Desktop */}
                <span className="absolute right-20 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
                    Add New Record
                </span>
            </button>
            <AnimatePresence>
                {isModalOpen && (
                    <RecordModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        initialData={selectedRecord}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}