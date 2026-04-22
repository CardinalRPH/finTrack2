import { motion } from "framer-motion"
import { HiOutlineXMark } from "react-icons/hi2"
import { IconRenderer } from "@/app/components/IconRenderer"
import { UseFormReturn } from "react-hook-form"
import { categoryCreateSchemaType } from "@/server/schemas/categorySchema"

function CategoryModal({ isPending, isEditing, onClose, reactForm, onSubmit }:
    {
        isPending: boolean
        isEditing: boolean,
        onClose: () => void,
        onSubmit: (value: categoryCreateSchemaType) => void,
        reactForm: UseFormReturn<categoryCreateSchemaType>
    }
) {
    const { formState: { errors }, handleSubmit, register, setValue, watch } = reactForm
    const selectedIcon = watch("icon")
    const selectedColor = watch("color")

    const iconOptions = [
        'HiOutlineShoppingCart', 'HiOutlineHome', 'HiOutlineWallet',
        'HiArrowsRightLeft', 'GiGoldBar', 'HiOutlineAcademicCap',
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
                        {isEditing ? 'Edit Category' : 'New Category'}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <HiOutlineXMark size={24} />
                    </button>
                </div>

                {/* ... (rest of your form content) ... */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Preview */}
                    <div className="flex justify-center">
                        <div className="p-6 rounded-3xl bg-slate-800 inline-block border-2 border-slate-700" style={{ color: selectedColor }}>
                            <IconRenderer iconName={selectedIcon} className="w-10 h-10" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500 mb-2 block">Category Name</label>
                        <input
                            {...register("name")}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Subscriptions"
                        />
                        {errors.name && (<p className="text-red-500 px-4">{errors.name.message}</p>)}
                    </div>

                    <div>
                        <label className="text-sm text-slate-500 mb-2 block">Select Icon</label>
                        <div className="grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto">
                            {iconOptions.map(opt => (
                                <button
                                    type="button"
                                    key={opt}
                                    onClick={() => setValue("icon", opt)}
                                    className={`p-3 rounded-xl flex justify-center transition-all ${selectedIcon === opt ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-500'}`}
                                >
                                    <IconRenderer iconName={opt} className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                        {errors.icon && (<p className="text-red-500 px-4">{errors.icon.message}</p>)}
                    </div>

                    <div>
                        <label className="text-sm text-slate-500 mb-2 block">Theme Color</label>
                        <input
                            type="color"
                            {...register("color")}
                            className="w-full h-12 bg-transparent cursor-pointer rounded-xl"
                        />
                        {errors.color && (<p className="text-red-500 px-4">{errors.color.message}</p>)}
                    </div>

                    <button disabled={isPending} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20">
                        {isEditing ? 'Save Changes' : 'Create Category'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

export default CategoryModal