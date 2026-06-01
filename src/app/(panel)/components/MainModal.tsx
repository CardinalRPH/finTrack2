import { motion } from "framer-motion"
import { ReactNode } from "react"
import { HiOutlineXMark } from "react-icons/hi2"

const MainModal = ({ onClose, modalName, children }: {
    onClose: () => void,
    modalName: string
    children: ReactNode

}) => {
    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">{modalName}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><HiOutlineXMark size={24} /></button>
                </div>

                {children}
            </motion.div>
        </div>
    )
}

export default MainModal