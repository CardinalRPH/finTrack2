// src/components/ui/Snackbar.tsx
"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    HiOutlineCheckCircle, 
    HiOutlineExclamationCircle, 
    HiOutlineXMark,
    HiOutlineInformationCircle
} from "react-icons/hi2"

export type SnackbarType = 'success' | 'error' | 'info'

interface SnackbarProps {
    isOpen: boolean
    message: string
    type?: SnackbarType
    onClose: () => void
    duration?: number
}

const styles = {
    success: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
        icon: <HiOutlineCheckCircle className="w-5 h-5" />
    },
    error: {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        text: 'text-rose-400',
        icon: <HiOutlineExclamationCircle className="w-5 h-5" />
    },
    info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        icon: <HiOutlineInformationCircle className="w-5 h-5" />
    }
}

export default function Snackbar({ 
    isOpen, 
    message, 
    type = 'success', 
    onClose, 
    duration = 3000 
}: SnackbarProps) {
    
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [isOpen, duration, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl min-w-[280px] max-w-sm ${styles[type].bg} ${styles[type].border}`}
                >
                    <div className={`${styles[type].text}`}>
                        {styles[type].icon}
                    </div>
                    
                    <p className="flex-1 text-sm font-medium text-slate-200">
                        {message}
                    </p>

                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white"
                    >
                        <HiOutlineXMark className="w-4 h-4" />
                    </button>

                    {/* Progress Bar (Visual Timer) */}
                    <motion.div 
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: duration / 1000, ease: "linear" }}
                        className={`absolute bottom-0 left-0 h-0.5 rounded-full ${styles[type].text} opacity-40`}
                        style={{ backgroundColor: 'currentColor' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}