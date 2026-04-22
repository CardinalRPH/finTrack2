"use client"

import { motion } from "framer-motion"
import { HiOutlineXMark, HiOutlineCalendarDays, HiOutlineChatBubbleBottomCenterText, HiOutlineTag, HiOutlineCreditCard, HiOutlineArrowsRightLeft } from "react-icons/hi2"
import { UseFormReturn } from 'react-hook-form'
import { CreateRecordFormInput, createRecordSchemaType } from '@/server/schemas/recordSchema'
import { Wallet } from '../../wallets/dto'
import { Category } from '../../categories/dto'
import { useEffect } from "react"

export default function RecordModal({ isPending, isEditing, onClose, reactForm, onSubmit, wallets, categories }: {
    wallets: Wallet[]
    categories: Category[]
    isPending: boolean
    isEditing: boolean,
    onClose: () => void,
    reactForm: UseFormReturn<CreateRecordFormInput>
    onSubmit: (value: CreateRecordFormInput) => void,
}) {
    const { formState: { errors }, handleSubmit, register, setValue, watch } = reactForm
    const type = watch("type")
    const isInvestment = watch("isInvestment")
    const gramAmount = watch("gramAmount")
    const buyPrice = watch("buyPrice")

    const walletId = watch("walletId")

    useEffect(() => {
        if (isInvestment && Boolean(gramAmount) && Boolean(buyPrice)) {
            setValue("amount", Number(gramAmount) * Number(buyPrice))
        }

    }, [isInvestment, gramAmount, buyPrice])



    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{isEditing ? 'Edit Record' : 'Add New Record'}</h3>
                    <button type="button" onClick={onClose} className="text-slate-500 hover:text-white"><HiOutlineXMark size={24} /></button>
                </div>

                <div className="space-y-5">
                    {/* Amount */}
                    <div className="text-center">
                        <input
                            disabled={isInvestment}
                            type="number"
                            {...register("amount", { valueAsNumber: true })}
                            className={`bg-transparent text-5xl font-black outline-none w-full text-center transition-colors ${type === 'INCOME' ? 'text-emerald-400' : type === 'TRANSFER' ? 'text-blue-400' : 'text-rose-400'}`}
                            placeholder="0"
                        />
                        {errors.amount && (<p className="text-red-500 px-4">{errors.amount.message}</p>)}
                    </div>

                    {/* Type Switcher */}
                    <div className="p-1 text-center">
                        <div className="flex bg-slate-950 rounded-2xl border border-slate-800">
                            {['OUTCOME', 'INCOME', 'TRANSFER'].map((t) => (
                                <button
                                    key={t} type="button"
                                    onClick={() => setValue("type", t as createRecordSchemaType["type"])}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${type === t ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        {errors.type && (<p className="text-red-500 px-4">{errors.type.message}</p>)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Wallet From */}
                        <div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 flex items-center gap-2"><HiOutlineCreditCard /> {type === 'TRANSFER' ? 'From Wallet' : 'Wallet'}</label>
                                <select
                                    {...register("walletId")}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none"
                                >
                                    <option value="">Select Wallet...</option>
                                    {wallets.map((value, index) => (
                                        <option key={`wall-${index}`} value={value.id}>{value.name}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.walletId && (<p className="text-red-500 px-4">{errors.walletId.message}</p>)}
                        </div>

                        {/* Wallet To (Transfer Only) */}
                        {type === 'TRANSFER' && (
                            <div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2"><HiOutlineArrowsRightLeft /> To Wallet</label>
                                    <select
                                        {...register("toWalletId")}
                                        disabled={Boolean(!walletId)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none"
                                    >
                                        <option value="">Select Target...</option>
                                        {wallets.map((value, index) => (
                                            <option key={`wallTo-${index}`} disabled={walletId === value.id} value={value.id}>{value.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.toWalletId && (<p className="text-red-500 px-4">{errors.toWalletId.message}</p>)}
                            </div>
                        )}

                        {/* Category (Non-Transfer Only) */}
                        {type !== 'TRANSFER' && (
                            <div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2"><HiOutlineTag /> Category</label>
                                    <select
                                        {...register("categoryId")}
                                        disabled={isInvestment}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none">
                                        <option value="">Select Category...</option>
                                        {categories.map((value, index) => (
                                            <option key={`cat-${index}`} value={value.id}>{value.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.categoryId && (<p className="text-red-500 px-4">{errors.categoryId.message}</p>)}
                            </div>
                        )}
                        <div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 flex items-center gap-2"><HiOutlineCalendarDays /> Date</label>
                                <input type="date"
                                    {...register("date")}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none scheme-dark" />
                            </div>
                            {errors.date && (<p className="text-red-500 px-4">{errors.date.message}</p>)}
                        </div>
                    </div>

                    {/* Gold Investment Switch */}
                    {type === 'OUTCOME' && (
                        <div>
                            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">✨</div>
                                    <div>
                                        <p className="text-sm font-bold">Gold Investment?</p>
                                        <p className="text-[10px] text-slate-500">Record this as gold asset</p>
                                    </div>
                                </div>
                                <input type="checkbox"
                                    checked={isInvestment}
                                    {...register("isInvestment")}
                                    className="w-5 h-5 accent-indigo-500" />

                            </div>
                            {errors.isInvestment && (<p className="text-red-500 px-4">{errors.isInvestment.message}</p>)}
                        </div>
                    )}

                    {isInvestment && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="space-y-4 pt-2 border-t border-slate-800/50 mt-2"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Weight (Gram)</label>
                                        <input
                                            type="number" step="0.001"
                                            {...register("gramAmount", { valueAsNumber: true })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-amber-500/50"
                                            placeholder="0.000"
                                        />
                                    </div>
                                    {errors.gramAmount && (<p className="text-red-500 px-4">{errors.gramAmount.message}</p>)}
                                </div>
                                <div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Buy Price /g</label>
                                        <input
                                            type="number"
                                            {...register("buyPrice", { valueAsNumber: true })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/50"
                                            placeholder="Rp"
                                        />
                                    </div>
                                    {errors.buyPrice && (<p className="text-red-500 px-4">{errors.buyPrice.message}</p>)}
                                </div>
                                <div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sell Price /g</label>
                                        <input
                                            type="number"
                                            {...register("sellPrice", { valueAsNumber: true })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-rose-500/50"
                                            placeholder="Rp"
                                        />
                                    </div>
                                    {errors.sellPrice && (<p className="text-red-500 px-4">{errors.sellPrice.message}</p>)}
                                </div>
                            </div>

                            {/* Info kalkulasi sederhana */}
                            {Boolean(gramAmount) && Boolean(buyPrice) && (
                                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                                    <p className="text-[10px] text-amber-500/80 uppercase font-medium">Estimated Total Value</p>
                                    <p className="text-sm font-bold text-amber-200">
                                        Rp {(Number(gramAmount) * Number(buyPrice)).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                    <div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 flex items-center gap-2"><HiOutlineChatBubbleBottomCenterText /> Description</label>
                            <textarea
                                {...register("description")}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none h-20 resize-none" placeholder="Note..." />
                        </div>
                        {errors.description && (<p className="text-red-500 px-4">{errors.description.message}</p>)}
                    </div>

                    <button disabled={isPending} type="submit" className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${type === 'INCOME' ? 'bg-emerald-600' : type === 'TRANSFER' ? 'bg-blue-600' : 'bg-rose-600'}`}>
                        {isEditing ? 'Update Record' : 'Save Record'}
                    </button>
                </div>
            </motion.form>
        </div>
    )
}