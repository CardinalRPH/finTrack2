"use client"
import { motion } from "framer-motion"
import { HiOutlineXMark, HiOutlineCreditCard, HiOutlineBanknotes, HiOutlineDevicePhoneMobile } from "react-icons/hi2"
import { UseFormReturn } from 'react-hook-form'
import { walletCreateSchemaType } from '@/server/schemas/walletSchema'
import { WalletType } from '../../../../../generated/prisma/enums'
import { walletDTO } from "@/server/dto/walletDTO"

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
    initData: walletDTO[]
    reactForm: UseFormReturn<walletCreateSchemaType>

}) {
  

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

                {/* this is form */}
            </motion.div>
        </div>
    )
}