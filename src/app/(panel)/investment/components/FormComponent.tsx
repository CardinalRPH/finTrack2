"use client"
import { investCreateSchema, investCreateSchemaType } from "@/server/schemas/investSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, UseFormClearErrors, UseFormReset } from "react-hook-form"
import { HiOutlineCube, HiOutlineCurrencyDollar, HiOutlineTag } from "react-icons/hi2"

const InvestFormComponent = ({ onSubmit, isPending, clearError, isEditing, resetVal }: {
    onSubmit: (value: investCreateSchemaType) => void,
    isEditing?: boolean
    clearError?: (clearErr: UseFormClearErrors<investCreateSchemaType>) => void
    resetVal?: (reset: UseFormReset<investCreateSchemaType>) => void
    isPending: boolean
}) => {
    const { handleSubmit, clearErrors, reset, register, formState: { errors } } = useForm({
        resolver: zodResolver(investCreateSchema)
    })

    useEffect(() => {
        if (resetVal) {
            resetVal(reset);
        }
        if (clearError) {
            clearError(clearErrors)
        }

    }, [clearErrors, clearError, resetVal, reset])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Asset Name</label>
                <div className="relative">
                    <HiOutlineTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input {...register("assetName")} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500" placeholder="e.g. Antam Gold, BBCA Stock" />
                </div>
                {errors.assetName && (<p className="text-red-500 px-4">{errors.assetName.message}</p>)}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Asset Provider</label>
                <div className="relative">
                    <HiOutlineCube className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input {...register("provider")} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500" placeholder="e.g. Bibit, Pluang, DANA" />
                </div>
                {errors.provider && (<p className="text-red-500 px-4">{errors.provider.message}</p>)}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Total Investment</label>
                <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" {...register("totalInvestment", { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); } })} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-indigo-500" placeholder="1000000" />
                </div>
                {errors.provider && (<p className="text-red-500 px-4">{errors.provider.message}</p>)}
            </div>

            <button disabled={isPending} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl mt-4 shadow-lg shadow-indigo-600/20 transition-all">
                {isEditing ? "Update Investment" : "Create Investment"}
            </button>
        </form>
    )
}

export default InvestFormComponent