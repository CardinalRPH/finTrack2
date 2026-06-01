import { IconRenderer } from "@/app/components/IconRenderer"
import { categoryDTO } from "@/server/dto/categoryDTO"
import { categoryCreateSchema, categoryCreateSchemaType } from "@/server/schemas/categorySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, UseFormClearErrors, UseFormReset } from "react-hook-form"

const iconOptions = [
    'HiOutlineShoppingCart', 'HiOutlineHome', 'HiOutlineWallet',
    'HiArrowsRightLeft', 'GiGoldBar', 'HiOutlineAcademicCap',
    'HiOutlineHeart', 'HiOutlineGift'
]

const CatFormComponents = ({ onSubmit, isPending, dataEdit, resetVal, clearError }: {
    onSubmit: (value: categoryCreateSchemaType) => void,
    isPending: boolean
    dataEdit?: categoryDTO | null
    clearError?: (clearErr: UseFormClearErrors<categoryCreateSchemaType>) => void
    resetVal?: (reset: UseFormReset<categoryCreateSchemaType>) => void
}) => {
    const { formState: { errors }, handleSubmit, register, setValue, watch, clearErrors, reset } = useForm({
        resolver: zodResolver(categoryCreateSchema)
    })

    const selectedIcon = watch("icon")
    const selectedColor = watch("color")

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
                {Boolean(dataEdit) ? 'Save Changes' : 'Create Category'}
            </button>
        </form>
    )
}

export default CatFormComponents