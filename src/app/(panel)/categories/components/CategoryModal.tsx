import { motion, AnimatePresence } from "framer-motion"
import { Category } from "../dto"
import { HiOutlineXMark } from "react-icons/hi2"
import { IconRenderer } from "@/app/components/IconRenderer"
import { useState } from "react"

function CategoryModal({ category, onClose }: { category: Category | null, onClose: () => void }) {
    const [name, setName] = useState(category?.name || '')
    const [icon, setIcon] = useState(category?.icon || 'HiOutlineTag')
    const [color, setColor] = useState(category?.color || '#6366f1')

    const iconOptions = [
        'HiOutlineShoppingCart', 'HiOutlineHome', 'HiOutlineWallet',
        'HiOutlineGlobeAmericas', 'GiGoldBar', 'HiOutlineAcademicCap',
        'HiOutlineHeart', 'HiOutlineGift'
    ]
    return (
        /* AnimatePresence is usually placed in the parent, 
           but for the internal logic, we use motion here */
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">

            {/* 1. Animated Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* 2. Animated Modal Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">
                        {category ? 'Edit Category' : 'New Category'}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <HiOutlineXMark size={24} />
                    </button>
                </div>

                {/* ... (rest of your form content) ... */}
                <div className="space-y-6">
                    {/* Preview */}
                    <div className="flex justify-center">
                        <div className="p-6 rounded-3xl bg-slate-800 inline-block border-2 border-slate-700" style={{ color }}>
                            <IconRenderer iconName={icon} className="w-10 h-10" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500 mb-2 block">Category Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Subscriptions"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-500 mb-2 block">Select Icon</label>
                        <div className="grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto">
                            {iconOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setIcon(opt)}
                                    className={`p-3 rounded-xl flex justify-center transition-all ${icon === opt ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-500'}`}
                                >
                                    <IconRenderer iconName={opt} className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500 mb-2 block">Theme Color</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full h-12 bg-transparent cursor-pointer rounded-xl"
                        />
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20">
                        {category ? 'Save Changes' : 'Create Category'}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default CategoryModal