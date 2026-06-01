import { categoryDTO } from "@/server/dto/categoryDTO"
import { createBudgetSchema, createBudgetSchemaType, updateBudgetSchemaType } from "@/server/schemas/budgetSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, UseFormClearErrors, UseFormReset } from "react-hook-form"

const BudgetFormComponents = ({ onSubmit, categoryData, clearError, dataEdit, resetVal, isPending, onCancel }: {
    onSubmit: (value: createBudgetSchemaType) => void,
    dataEdit?: updateBudgetSchemaType | null
    categoryData: categoryDTO[]
    clearError?: (clearErr: UseFormClearErrors<createBudgetSchemaType>) => void
    resetVal?: (reset: UseFormReset<createBudgetSchemaType>) => void
    isPending: boolean
    onCancel: () => void
}) => {
    const { handleSubmit, clearErrors, reset, register, formState: { errors } } = useForm({
        resolver: zodResolver(createBudgetSchema)
    })

    useEffect(() => {
        if (resetVal) {
            resetVal(reset);
        }
        if (clearError) {
            clearError(clearErrors)
        }

    }, [clearErrors, clearError, resetVal, reset])

    useEffect(() => {
        if (dataEdit) {
            reset(dataEdit)
        }
    }, [dataEdit])
    
    return (
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
                    onClick={onCancel}
                    className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                    Cancel
                </button>
                <button
                    disabled={isPending}
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
                >
                    {Boolean(dataEdit) ? "Update Budget" : "Set Budget"}
                </button>
            </div>
        </form>
    )
}

export default BudgetFormComponents