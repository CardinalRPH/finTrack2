"use client"
import { motion } from "framer-motion"
import { HiOutlineXMark, HiOutlineCreditCard, HiOutlineBanknotes, HiOutlineDevicePhoneMobile } from "react-icons/hi2"
import { UseFormReturn } from 'react-hook-form'
import { walletCreateSchemaType } from '@/server/schemas/walletSchema'
import { Wallet } from '../dto'
import { WalletType } from '../../../../../generated/prisma/enums'

const WALLET_TYPES = [
    { id: 'E_WALLET' as WalletType, label: 'E-Wallet', icon: HiOutlineDevicePhoneMobile },
    { id: 'BANK' as WalletType, label: 'Card / Bank', icon: HiOutlineCreditCard },
    { id: 'CASH' as WalletType, label: 'Physical Cash', icon: HiOutlineBanknotes },
]

export default function WalletModal({ onClose, isEditing, reactForm, initData, isPending, onSubmit }: {
    isPending: boolean
    isEditing: boolean,
    onClose: () => void,
    onSubmit: (value: walletCreateSchemaType) => void,
    initData: Wallet[]
    reactForm: UseFormReturn<walletCreateSchemaType>

}) {
    const { formState: { errors }, handleSubmit, register, setValue, watch } = reactForm
    const selectedType = watch("type")

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">{isEditing ? 'Edit Wallet' : 'Create Wallet'}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><HiOutlineXMark size={24} /></button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Wallet Name */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Wallet Name</label>
                        <input
                            {...register("name")}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. BCA Savings"
                        />
                        {errors.name && (<p className="text-red-500 px-4">{errors.name.message}</p>)}
                    </div>

                    {/* Type Selection Logic */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Wallet Type</label>
                        <div className="grid grid-cols-1 gap-2">
                            {WALLET_TYPES.map((t) => {
                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setValue("type", t.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedType === t.id
                                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <t.icon size={20} />
                                            <span className="font-bold">{t.label}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                        {errors.type && (<p className="text-red-500 px-4">{errors.type.message}</p>)}
                    </div>

                    {/* Initial Balance */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Current Balance</label>
                        <input
                            type="number"
                            {...register("balance", { valueAsNumber: true })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="0"
                        />
                        {errors.balance && (<p className="text-red-500 px-4">{errors.balance.message}</p>)}
                    </div>

                    <button disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg">
                        {isEditing ? 'Update Wallet' : 'Create Wallet'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}