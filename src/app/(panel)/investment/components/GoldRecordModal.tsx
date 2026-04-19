// src/components/modals/GoldRecordModal.tsx
"use client"
import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { HiOutlineXMark, HiOutlineCalendarDays, HiOutlineScale } from "react-icons/hi2"

export default function GoldRecordModal({ isOpen, onClose, initialData, onSave }: any) {
    const [grams, setGrams] = useState(initialData?.amount || '')
    const [pricePerGram, setPricePerGram] = useState(initialData?.price || 1245000)
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])

    const totalCost = Number(grams) * Number(pricePerGram)

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
                {/* Gold Glow Effect */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/10 blur-[80px]" />

                <div className="flex justify-between items-center mb-8 relative">
                    <h3 className="text-xl font-bold">{initialData ? 'Edit Gold Purchase' : 'Add Gold Purchase'}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><HiOutlineXMark size={24} /></button>
                </div>

                <div className="space-y-6 relative">
                    {/* Gram Input */}
                    <div className="text-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Weight (Grams)</label>
                        <div className="flex items-center justify-center gap-2">
                            <input
                                type="number" step="0.01" value={grams} onChange={(e) => setGrams(e.target.value)}
                                className="bg-transparent text-6xl font-black outline-none w-full text-center placeholder:text-slate-800 text-amber-400"
                                placeholder="0.0"
                            />
                            <span className="text-2xl font-bold text-slate-600">gr</span>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <HiOutlineScale size={14} /> Price per Gram
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                                <input
                                    type="number" value={pricePerGram} onChange={(e) => setPricePerGram(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <HiOutlineCalendarDays size={14} /> Date
                            </label>
                            <input
                                type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    {/* Dynamic Summary */}
                    <div className="flex justify-between items-center px-2">
                        <span className="text-slate-500 text-sm">Total Investment:</span>
                        <span className="text-xl font-black text-white">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalCost)}
                        </span>
                    </div>

                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-amber-500/10">
                        {initialData ? 'Update Record' : 'Add to Portfolio'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}