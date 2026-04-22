// src/components/modals/ErrorModal.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { HiOutlineXMark, HiOutlineExclamationTriangle } from "react-icons/hi2"

interface ErrorModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    message: string
}

export default function ErrorModal({ isOpen, onClose, title = "Action Failed", message }: ErrorModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-slate-900 border border-rose-500/30 w-full max-w-sm rounded-4xl p-6 shadow-2xl shadow-rose-500/10"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon Wrapper */}
                            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 shadow-inner">
                                <HiOutlineExclamationTriangle size={32} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-100">{title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {message || "An unexpected error occurred. Please try again."}
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>

                        {/* Close button top right */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <HiOutlineXMark size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}