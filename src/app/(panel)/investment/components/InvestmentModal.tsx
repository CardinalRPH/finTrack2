"use client"

import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { HiOutlineXMark, HiOutlineTag, HiOutlineCube } from 'react-icons/hi2'

export default function CreateInvestmentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { register, handleSubmit } = useForm()

    const onSubmit = (data: any) => {
        console.log("Creating Investment Category:", data)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Asset Type</label>
                        <div className="relative">
                            <HiOutlineCube className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <select {...register("type")} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500 appearance-none">
                                <option value="GOLD">Gold</option>
                                <option value="STOCK">Stock</option>
                                <option value="CRYPTO">Crypto</option>
                                <option value="MUTUAL_FUND">Mutual Fund</option>
                            </select>
                        </div>
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl mt-4 shadow-lg shadow-indigo-600/20 transition-all">
                        Create Category
                    </button>
                </form>
            </motion.div>
        </div>
    )
}