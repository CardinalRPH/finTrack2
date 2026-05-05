import { categoryDTO } from "@/server/dto/categoryDTO"
import { createBudgetSchemaType } from "@/server/schemas/budgetSchema"
import { motion } from "framer-motion"
import { UseFormReturn } from "react-hook-form"
import { HiOutlineX } from "react-icons/hi"

const BudgetModal = ({ onClose, isEditing, isPending, onSubmit, reactForm, categoryData }: {
    onClose: () => void,
    isPending: boolean
    isEditing: boolean,
    onSubmit: (value: createBudgetSchemaType) => void,
    reactForm: UseFormReturn<createBudgetSchemaType>,
    categoryData: categoryDTO[]
}) => {
    const { formState: { errors }, handleSubmit, register, } = reactForm


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-lg p-10 rounded-[3rem] shadow-2xl overflow-hidden"
            >

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Create Budget</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <HiOutlineX size={24} />
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Category</label>
                        <select
                            {...register("categoryId")}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
                        >
                            <option value="">Select Category</option>
                            {categoryData.map((value, index) => (
                                <option value={value.id} key={`catBud-${index}`}>{value.name}</option>
                            ))}
                            <option value="transport">Transportation</option>
                        </select>
                        {errors.categoryId && (<p className="text-red-500 px-4">{errors.categoryId.message}</p>)}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Amount Limit</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                            <input
                                type="number"
                                {...register("amount", { valueAsNumber: true })}
                                placeholder="0"
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                        {errors.amount && (<p className="text-red-500 px-4">{errors.amount.message}</p>)}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Budget Date</label>
                        <input
                            {...register("monthYear")}
                            type="month"
                            placeholder="0"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all scheme-dark"
                        />
                        {errors.monthYear && (<p className="text-red-500 px-4">{errors.monthYear.message}</p>)}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isPending}
                            type="submit"
                            className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            {isEditing ? "Update Budget" : "Set Budget"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default BudgetModal