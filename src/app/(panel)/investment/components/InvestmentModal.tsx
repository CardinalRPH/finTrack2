"use client"

import { useForm, UseFormReturn } from 'react-hook-form'
import { motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineTag, HiOutlineCube, HiOutlineCurrencyDollar } from 'react-icons/hi2'
import { investCreateSchemaType } from '@/server/schemas/investSchema'

export default function CreateInvestmentModal({ onClose, onSubmit, isEditing, isPending, reactForm }
    : {
        isPending: boolean
        isEditing: boolean,
        onClose: () => void
        onSubmit: (value: investCreateSchemaType) => void,
        reactForm: UseFormReturn<investCreateSchemaType>
    }
) {
    const { formState: { errors }, handleSubmit, register, setValue, watch } = reactForm

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-white">New Investment Category</h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white"><HiOutlineXMark size={24} /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Asset Name</label>
                        <div className="relative">
                            <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input {...register("assetName")} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500" placeholder="e.g. Antam Gold, BBCA Stock" />
                        </div>
                        {errors.assetName && (<p className="text-red-500 px-4">{errors.assetName.message}</p>)}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Asset Provider</label>
                        <div className="relative">
                            <HiOutlineCube className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input {...register("provider")} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500" placeholder="e.g. Bibit, Pluang, DANA" />
                        </div>
                        {errors.provider && (<p className="text-red-500 px-4">{errors.provider.message}</p>)}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Total Investment</label>
                        <div className="relative">
                            <HiOutlineCurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="text" {...register("totalInvestment",)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500" placeholder="1000000" />
                        </div>
                        {errors.provider && (<p className="text-red-500 px-4">{errors.provider.message}</p>)}
                    </div>

                    <button disabled={isPending} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl mt-4 shadow-lg shadow-indigo-600/20 transition-all">
                        {isEditing ? "Update Investment" : "Create Investment"}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}