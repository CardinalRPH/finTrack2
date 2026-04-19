"use client"

import React, { useState } from 'react'
import { HiOutlinePlus, HiOutlineCreditCard, HiOutlineBanknotes, HiOutlineDevicePhoneMobile, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2"
import { AnimatePresence } from 'framer-motion'
import WalletModal from './components/WalletModal'

export interface Wallet {
    id: string
    name: string
    type: 'E-WALLET' | 'CARD' | 'CASH'
    balance: number
    color: string
}

const initialWallets: Wallet[] = [
    { id: '1', name: 'Digital Pay', type: 'E-WALLET', balance: 2500000, color: '#6366f1' },
    { id: '2', name: 'Main Bank', type: 'CARD', balance: 15000000, color: '#ec4899' },
]

export default function WalletPage() {
    const [wallets, setWallets] = useState<Wallet[]>(initialWallets)
    const [isModalOpen, setModalOpen] = useState(false)
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null)

    // Identify which types are already taken
    const takenTypes = wallets.map(w => w.type)

    const handleOpenAdd = () => {
        setEditingWallet(null)
        setModalOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Delete this wallet? All linked records will lose their wallet reference.")) {
            setWallets(wallets.filter(w => w.id !== id))
        }
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet) => (
                    <div
                        key={wallet.id}
                        className="relative group bg-slate-900 border border-slate-800 p-6 rounded-4xl overflow-hidden transition-all hover:border-slate-700 shadow-xl"
                    >
                        {/* Background Glow Deco */}
                        <div className="absolute -right-10 -top-10 w-32 h-32 blur-[80px] opacity-20" style={{ backgroundColor: wallet.color }} />

                        <div className="flex justify-between items-start mb-8">
                            <div className="p-4 rounded-2xl bg-slate-800 text-white shadow-inner" style={{ color: wallet.color }}>
                                {wallet.type === 'CARD' && <HiOutlineCreditCard size={28} />}
                                {wallet.type === 'CASH' && <HiOutlineBanknotes size={28} />}
                                {wallet.type === 'E-WALLET' && <HiOutlineDevicePhoneMobile size={28} />}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => { setEditingWallet(wallet); setModalOpen(true); }} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <HiOutlinePencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(wallet.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                                    <HiOutlineTrash size={18} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-1">{wallet.name}</p>
                            <h3 className="text-3xl font-black text-white">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(wallet.balance)}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
            {takenTypes.length < 3 && (
                <button
                    onClick={handleOpenAdd}
                    className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                >
                    <HiOutlinePlus className="w-8 h-8 transition-transform group-hover:rotate-90" />

                    {/* Tooltip */}
                    <span className="absolute right-20 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
                        Create New Wallet
                    </span>
                </button>
            )}
            <AnimatePresence>
                {isModalOpen && (
                    <WalletModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        initialData={editingWallet}
                        takenTypes={takenTypes}
                        onSave={(data) => console.log("Saving Wallet:", data)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}