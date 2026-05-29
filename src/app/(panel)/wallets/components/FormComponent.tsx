"use client"
import { walletCreateSchema, walletCreateSchemaType } from "@/server/schemas/walletSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { WalletType } from "../../../../../generated/prisma/enums"
import { HiOutlineBanknotes, HiOutlineCreditCard, HiOutlineDevicePhoneMobile } from "react-icons/hi2"
import { walletDTO } from "@/server/dto/walletDTO"
import { useEffect } from "react"


const WALLET_TYPES = [
    { id: 'E_WALLET' as WalletType, label: 'E-Wallet', icon: HiOutlineDevicePhoneMobile },
    { id: 'BANK' as WalletType, label: 'Card / Bank', icon: HiOutlineCreditCard },
    { id: 'CASH' as WalletType, label: 'Physical Cash', icon: HiOutlineBanknotes },
]


const FormComponents = ({ onSubmit, isPending, dataEdit }: {
    onSubmit: (value: walletCreateSchemaType) => void,
    isPending: boolean
    dataEdit?: Omit<walletDTO, "id">
}) => {
    const { formState: { errors }, handleSubmit, register, setValue, watch } = useForm({
        resolver: zodResolver(walletCreateSchema)
    })
    const selectedType = watch("type")

    useEffect(() => {
        if (dataEdit) {
            setValue("balance", Number(dataEdit.balance))
            setValue("name", dataEdit.name)
            setValue("type", dataEdit.type)
        }
    }, [dataEdit])
    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Wallet Name */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Wallet Name</label>
                <input
                    {...register("name")}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. BCA Savings"
                />
                {errors.name && (<p className="text-red-500 px-4">{errors.name.message}</p>)}
            </div>

            {/* Type Selection Logic */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Wallet Type</label>
                <div className="grid grid-cols-1 gap-2">
                    {WALLET_TYPES.map((t) => {
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setValue("type", t.id)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedType === t.id
                                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <t.icon size={20} />
                                    <span className="font-bold">{t.label}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
                {errors.type && (<p className="text-red-500 px-4">{errors.type.message}</p>)}
            </div>

            {/* Initial Balance */}
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Current Balance</label>
                <input
                    type="number"
                    {...register("balance", { valueAsNumber: true })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                />
                {errors.balance && (<p className="text-red-500 px-4">{errors.balance.message}</p>)}
            </div>

            <button disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg">
                {Boolean(dataEdit) ? 'Update Wallet' : 'Create Wallet'}
            </button>
        </form>
    )
}

export default FormComponents