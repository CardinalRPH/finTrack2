// src/components/modals/WalletModal.tsx
"use client"
import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { HiOutlineXMark, HiOutlineCreditCard, HiOutlineBanknotes, HiOutlineDevicePhoneMobile } from "react-icons/hi2"

const WALLET_TYPES = [
    { id: 'E-WALLET', label: 'E-Wallet', icon: HiOutlineDevicePhoneMobile },
    { id: 'CARD', label: 'Card / Bank', icon: HiOutlineCreditCard },
    { id: 'CASH', label: 'Physical Cash', icon: HiOutlineBanknotes },
]

export default function WalletModal({ isOpen, onClose, initialData, takenTypes, onSave }: any) {
    const [name, setName] = useState(initialData?.name || '')
    const [type, setType] = useState(initialData?.type || '')
    const [balance, setBalance] = useState(initialData?.balance || '')

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">{initialData ? 'Edit Wallet' : 'Create Wallet'}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><HiOutlineXMark size={24} /></button>
                </div>

                <div className="space-y-6">
                    {/* Wallet Name */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Wallet Name</label>
                        <input
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. BCA Savings"
                        />
                    </div>

                    {/* Type Selection Logic */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Wallet Type</label>
                        <div className="grid grid-cols-1 gap-2">
                            {WALLET_TYPES.map((t) => {
                                const isTaken = takenTypes.includes(t.id) && initialData?.type !== t.id

                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        disabled={isTaken}
                                        onClick={() => setType(t.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${type === t.id
                                                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                                : isTaken
                                                    ? 'bg-slate-950 border-slate-900 opacity-30 cursor-not-allowed'
                                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <t.icon size={20} />
                                            <span className="font-bold">{t.label}</span>
                                        </div>
                                        {isTaken && <span className="text-[10px] font-black uppercase bg-slate-800 px-2 py-1 rounded-md">Exists</span>}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Initial Balance */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Current Balance</label>
                        <input
                            type="number" value={balance} onChange={(e) => setBalance(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="0"
                        />
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg">
                        {initialData ? 'Update Wallet' : 'Create Wallet'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}