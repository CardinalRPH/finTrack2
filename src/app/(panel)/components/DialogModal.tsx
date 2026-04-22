// src/components/modals/ConfirmModal.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineExclamationTriangle, HiOutlineXMark } from "react-icons/hi2"

interface ConfirmModalProps {
    isOpen: boolean
    isPending: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'primary'
}

const variants = {
    danger: {
        iconBg: 'bg-rose-500/10',
        iconText: 'text-rose-500',
        button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20',
        border: 'border-rose-500/20'
    },
    warning: {
        iconBg: 'bg-amber-500/10',
        iconText: 'text-amber-500',
        button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20',
        border: 'border-amber-500/20'
    },
    primary: {
        iconBg: 'bg-indigo-500/10',
        iconText: 'text-indigo-500',
        button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20',
        border: 'border-indigo-500/20'
    }
}

export default function ConfirmModal({
    isOpen,
    isPending,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message,
    confirmText = "Yes, Delete",
    cancelText = "Cancel",
    variant = 'danger'
}: ConfirmModalProps) {

    const style = variants[variant]

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`relative bg-slate-900 border ${style.border} w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl`}
                    >
                        <div className="flex flex-col items-center text-center">
                            {/* Warning Icon */}
                            <div className={`w-20 h-20 ${style.iconBg} ${style.iconText} rounded-full flex items-center justify-center mb-6`}>
                                <HiOutlineExclamationTriangle size={40} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-100 mb-2">{title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button disabled={isPending}
                                    onClick={() => {
                                        onConfirm()
                                        onClose()
                                    }}
                                    className={`w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg ${style.button}`}
                                >
                                    {confirmText}
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-transparent hover:bg-slate-800 text-slate-400 rounded-2xl font-semibold transition-all"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        {/* Close Icon (Top Right) */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                        >
                            <HiOutlineXMark size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}