"use client"

import { categoryDTO } from "@/server/dto/categoryDTO"
import { investDataDTO } from "@/server/dto/investDTO"
import { walletDTO } from "@/server/dto/walletDTO"
import { CreateRecordFormInput, createRecordSchema } from "@/server/schemas/recordSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useForm, UseFormClearErrors, UseFormReset } from "react-hook-form"
import { HiOutlineCreditCard, HiOutlineArrowsRightLeft, HiOutlineTag, HiOutlineCalendarDays, HiOutlineSparkles, HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2"
import { Transaction } from "../dto"

const RecordFormComponent = ({ categories, investments, isPending, onSubmit, wallets, clearError, dataEdit, resetVal }: {
    onSubmit: (value: CreateRecordFormInput) => void,
    dataEdit?: Transaction["data"] | null
    clearError?: (clearErr: UseFormClearErrors<CreateRecordFormInput>) => void
    resetVal?: (reset: UseFormReset<CreateRecordFormInput>) => void
    isPending: boolean
    wallets: walletDTO[]
    categories: categoryDTO[]
    investments: investDataDTO[]
}) => {
    const { formState: { errors }, handleSubmit, register, setValue, watch, reset, clearErrors } = useForm({
        resolver: zodResolver(createRecordSchema),
        defaultValues: {
            date: new Date(),
            isInvestment: false,
            type: "OUTCOME"
        }
    })

    const type = watch("type")
    const isInvestment = watch("isInvestment")
    const walletId = watch("walletId")

    useEffect(() => {
        if (resetVal) {
            resetVal(reset);
        }
        if (clearError) {
            clearError(clearErrors)
        }

    }, [clearErrors, clearError, resetVal, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Input */}
            <div className="text-center">
                <input
                    type="text"
                    {...register("amount", {
                        valueAsNumber: true,
                        onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); }
                    })}
                    className={`bg-transparent text-5xl font-black outline-none w-full text-center transition-colors ${type === 'INCOME' ? 'text-emerald-400' :
                        type === 'TRANSFER' ? 'text-blue-400' : 'text-rose-400'
                        } ${isInvestment ? 'opacity-70' : ''}`}
                    placeholder="0"
                />
                {errors.amount && (<p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>)}
            </div>

            {/* Type Switcher */}
            <div className="p-1">
                <div className="flex bg-slate-950 rounded-2xl border border-slate-800 p-1">
                    {['OUTCOME', 'INCOME', 'TRANSFER'].map((t) => (
                        <button
                            key={t} type="button"
                            onClick={() => {
                                setValue("type", t as any)
                                if (t !== 'OUTCOME') setValue("isInvestment", false)
                            }}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${type === t ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Wallet Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <HiOutlineCreditCard /> {type === 'TRANSFER' ? 'From Wallet' : 'Wallet'}
                    </label>
                    <select
                        {...register("walletId")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                    >
                        <option value="">Select Wallet...</option>
                        {wallets.map((w) => (
                            <option key={w.id} value={w.id}>{w.name} (Rp {w.balance.toLocaleString()})</option>
                        ))}
                    </select>
                    {errors.walletId && (<p className="text-red-400 text-[10px]">{errors.walletId.message}</p>)}
                </div>

                {/* Condition: Transfer vs Category vs Date */}
                {type === 'TRANSFER' ? (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                            <HiOutlineArrowsRightLeft /> To Wallet
                        </label>
                        <select
                            {...register("toWalletId")}
                            disabled={!walletId}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                        >
                            <option value="">Select Target...</option>
                            {wallets.filter(w => w.id !== walletId).map((w) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                            <HiOutlineTag /> Category
                        </label>
                        <select
                            {...register("categoryId")}
                            disabled={isInvestment}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 disabled:opacity-50"
                        >
                            <option value="">{isInvestment ? 'Investment (Auto)' : 'Select Category...'}</option>
                            {categories.filter(val => !val.name.includes("CTX.Invest") || !val.name.includes("CTX.Transfer")).map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <HiOutlineCalendarDays /> Date
                    </label>
                    <input type="date"
                        {...register("date")}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none scheme-dark"
                    />
                </div>
            </div>

            {/* Investment Switch */}
            {type === 'OUTCOME' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><HiOutlineSparkles /></div>
                            <div>
                                <p className="text-sm font-bold">Investment Activity?</p>
                                <p className="text-[10px] text-slate-500">Link this outcome to an investment asset</p>
                            </div>
                        </div>
                        <input type="checkbox"
                            {...register("isInvestment")}
                            className="w-5 h-5 accent-amber-500 cursor-pointer"
                        />
                    </div>

                    {isInvestment && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="space-y-4 p-5 rounded-4xl bg-amber-500/5 border border-amber-500/10"
                        >
                            {/* Dropdown Aset */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-amber-500 flex items-center gap-2 px-1">
                                    <HiOutlineSparkles /> Chose Invest Asset
                                </label>
                                <select
                                    {...register("investmentId")}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:border-amber-500"
                                >
                                    <option value="">Assets Name?</option>
                                    {investments.map((inv) => (
                                        <option key={inv.id} value={inv.id}>
                                            {inv.assetName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Description */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <HiOutlineChatBubbleBottomCenterText /> Description
                </label>
                <textarea
                    {...register("description")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none h-20 resize-none focus:border-indigo-500"
                    placeholder="Add notes..."
                />
            </div>

            <button
                disabled={isPending}
                type="submit"
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-500' :
                    type === 'TRANSFER' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-rose-600 hover:bg-rose-500'
                    }`}
            >
                {isPending ? 'Processing...' : Boolean(dataEdit) ? 'Update Record' : 'Save Record'}
            </button>
        </form>
    )
}

export default RecordFormComponent