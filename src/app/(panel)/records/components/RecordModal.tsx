// src/components/modals/RecordModal.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import {
    HiOutlineXMark, HiOutlineCalendarDays,
    HiOutlineChatBubbleBottomCenterText, HiOutlineTag
} from "react-icons/hi2"

interface RecordModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: any // Pass existing record for "Edit" mode
    onSave: (data: any) => void
}

export default function RecordModal({ isOpen, onClose, initialData, onSave }: RecordModalProps) {
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>(initialData?.type || 'EXPENSE')
    const [amount, setAmount] = useState(initialData?.amount || '')
    const [category, setCategory] = useState(initialData?.categoryId || '')
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
    const [note, setNote] = useState(initialData?.note || '')

    // Update state if initialData changes (for Edit mode)
    useEffect(() => {
        if (initialData) {
            setType(initialData.type)
            setAmount(initialData.amount)
            setCategory(initialData.categoryId)
            setDate(initialData.date)
            setNote(initialData.note)
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ type, amount: Number(amount), categoryId: category, date, note })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">{initialData ? 'Edit Record' : 'Add Record'}</h3>
                    <button type="button" onClick={onClose} className="text-slate-500 hover:text-white"><HiOutlineXMark size={24} /></button>
                </div>

                <div className="space-y-6">
                    {/* Amount Display with Dynamic Color */}
                    <div className="text-center space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nominal Amount</label>
                        <div className="flex items-center justify-center gap-2">
                            <span className={`text-2xl font-bold transition-colors ${type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>Rp</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={`bg-transparent text-5xl font-black outline-none w-full text-center transition-colors placeholder:text-slate-800 ${type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Flexible Type Switcher */}
                    <div className="flex p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                        <button
                            type="button"
                            onClick={() => setType('EXPENSE')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${type === 'EXPENSE' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Outcome
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('INCOME')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${type === 'INCOME' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Income
                        </button>
                    </div>

                    {/* Grid Layout for Date & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><HiOutlineCalendarDays /> Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><HiOutlineTag /> Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                                required
                            >
                                <option value="">Select...</option>
                                <option value="food">Food & Drink</option>
                                <option value="salary">Salary</option>
                                <option value="investment">Investment (Gold)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><HiOutlineChatBubbleBottomCenterText /> Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ex: Buy gold 1 gram"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] ${type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/10'
                            }`}
                    >
                        {initialData ? 'Update Record' : 'Save Record'}
                    </button>
                </div>
            </motion.form>
        </div>
    )
}