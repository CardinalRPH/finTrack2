"use client"

import { IconRenderer } from '@/app/components/IconRenderer'
import { useEffect, useState } from 'react'
import {
    HiOutlineAdjustmentsHorizontal,

    HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiArrowsRightLeft,
    HiChevronRight,
    HiChevronLeft
} from "react-icons/hi2"
import { HiOutlineSearch } from "react-icons/hi";
import { AnimatePresence } from 'framer-motion';
import RecordModal from './components/RecordModal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRecordFormInput, createRecordSchema, createRecordSchemaType, getAllRecordSchemaType } from '@/server/schemas/recordSchema';
import { useSnackbar } from '@/stores/toastStore';
import { useCreateRecord, useDeleteRecord, useGetRecord, useUpdateRecord } from '@/hooks/recordHook';
import ErrorModal from '../components/ErrorModal';
import ConfirmModal from '../components/DialogModal';
import { useGetWallet } from '@/hooks/walletHook';
import { useGetCategory } from '@/hooks/categoryHook';
import getVisiblePages from '@/utils/getVisiblePage';
import { useGetInvest } from '@/hooks/investHook';
import { RecordSkeleton } from './components/Skeleton';
import { Transaction } from './dto';



export default function RecordsPage() {
    const [timeRange, setTimeRange] = useState<getAllRecordSchemaType["range"]>('7D')
    const ranges = ['7D', '30D', '12W', '6M', '1Y']

    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<Transaction["data"] | null>(null)
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [targetId, setTargetId] = useState<string | null>(null)

    const [page, setPage] = useState(1)

    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetRecord({
        filter: {
            range: timeRange,
            page
        }
    })
    const { mutate: createRec, error: createErrMsg, isPending: createPend, isError: createErr, isSuccess: createScss } = useCreateRecord()
    const { mutate: updateRec, error: updateErrMsg, isPending: updatePend, isError: updateErr, isSuccess: updateScss } = useUpdateRecord()
    const { mutate: deleteRec, error: deleteErrMsg, isPending: deletePend, isError: deleteErr, isSuccess: deleteScss } = useDeleteRecord()
    const { data: wallData, error: wallErrMsg, isError: wallErr } = useGetWallet()
    const { data: catData, error: catErrMsg, isError: catErr } = useGetCategory()
    const { data: invData, error: invErrMsg, isError: invErr } = useGetInvest()

    const reactForm = useForm<CreateRecordFormInput>({
        resolver: zodResolver(createRecordSchema),
        defaultValues: {
            date: new Date(),
            isInvestment: false,
            type: "OUTCOME"
        }
    })
    const { reset, clearErrors } = reactForm

    // Pagination State
    const itemsPerPage = 20
    // Logika Kalkulasi Data
    const totalPages = data?.pagination.totalPages ?? 1

    const visiblePages = getVisiblePages(page, totalPages)

    const { show: showToast } = useSnackbar()

    const onSubmit = (value: CreateRecordFormInput) => {
        console.log(value)
        if (!selectedRecord) {
            createRec(value)
        } else {
            updateRec({ id: selectedRecord.id, data: value })
        }
    }

    const onDelete = () => {
        deleteRec({ id: targetId! })
    }

    const handleDelete = (id: string) => {
        setTargetId(id)
        setIsConfirmOpen(true)
    }


    const openModal = (value: Transaction["data"] | null = null) => {
        if (value) {
            const baseData = {
                type: value.type,
                amount: Number(value.amount),
                walletId: value.walletId,
                date: new Date(value.date),
                description: value.description || undefined,
            };

            let formData: any;

            if (value.type === "OUTCOME") {
                if (value.isInvestment) {
                    formData = {
                        ...baseData,
                        type: "OUTCOME" as const,
                        isInvestment: true as const,
                        investmentId: value.investmentId || "",
                        categoryId: undefined,
                        toWalletId: undefined,
                    };
                } else {
                    formData = {
                        ...baseData,
                        type: "OUTCOME" as const,
                        isInvestment: false as const,
                        categoryId: value.categoryId || "",
                        investmentId: undefined,
                        toWalletId: undefined,
                    };
                }
            } else if (value.type === "INCOME") {
                formData = {
                    ...baseData,
                    type: "INCOME" as const,
                    isInvestment: false as const,
                    categoryId: undefined,
                    investmentId: undefined,
                    toWalletId: undefined,
                };
            } else if (value.type === "TRANSFER") {
                formData = {
                    ...baseData,
                    type: "TRANSFER" as const,
                    isInvestment: false as const,
                    toWalletId: value.toWalletId || "",
                    categoryId: undefined,
                    investmentId: undefined,
                };
            }

            reset(formData);
        } else {
            reset({
                type: 'OUTCOME',
                amount: 0,
                date: new Date(),
                categoryId: "",
                walletId: "",
                isInvestment: false
            });
        }
        setSelectedRecord(value)
        setModalOpen(true)
    }


    const onModalClose = () => {
        clearErrors()
        setModalOpen(false)
    }

    useEffect(() => {
        if (getErr) {
            setErrMdOpen(getErr)
            setErrMsg(getErrMsg.message)
        }
        if (createErr) {
            setErrMdOpen(createErr)
            setErrMsg(createErrMsg.message)
        }
        if (updateErr) {
            setErrMdOpen(updateErr)
            setErrMsg(updateErrMsg.message)
        }
        if (deleteErr) {
            setErrMdOpen(deleteErr)
            setErrMsg(deleteErrMsg.message)
        }
        if (catErr) {
            setErrMdOpen(catErr)
            setErrMsg(catErrMsg.message)
        }
        if (wallErr) {
            setErrMdOpen(wallErr)
            setErrMsg(wallErrMsg.message)
        }
        if (invErr) {
            setErrMdOpen(invErr)
            setErrMsg(invErrMsg.message)
        }

    }, [getErr, createErr, updateErr, deleteErr, catErr, wallErr, invErr])

    useEffect(() => {
        if (createScss) {
            setSelectedRecord(null)
            setModalOpen(false)
            showToast("Record Created", "success")
            reset()
        }
        if (updateScss) {
            setSelectedRecord(null)
            setModalOpen(false)
            showToast("Record Updated", "success")
            reset()
        }
        if (deleteScss) {
            setIsConfirmOpen(false)
            setTargetId(null)
            showToast("Record Deleted", "success")
        }
    }, [createScss, updateScss, deleteScss])

    if (isLoading) return <RecordSkeleton />

    return (
        <div className="pb-24">
            <div className="space-y-6">
                {/* Header & Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        {ranges.map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range as getAllRecordSchemaType["range"])}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${timeRange === range
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 lg:w-64">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white">
                            <HiOutlineAdjustmentsHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {/* Table List */}

                <div className="bg-slate-900/20 border border-slate-800 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Info</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Note</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {data?.data.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700"
                                                    style={{ color: tx.category?.color || '#94a3b8' }}>
                                                    {tx.type === 'TRANSFER'
                                                        ? <HiArrowsRightLeft size={20} />
                                                        : <IconRenderer iconName={tx.category?.icon || 'HiOutlineTag'} className="w-5 h-5" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-200">
                                                        {tx.type === 'TRANSFER' ? 'Transfer' : tx.category?.name}
                                                    </p>
                                                    {/* Parsing tanggal karena response Prisma adalah Date object */}
                                                    <p className="text-[10px] text-slate-500 uppercase">
                                                        {new Date(tx.date).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">
                                            {tx.wallet.name} {tx.type === 'TRANSFER' && `→ ${tx.toWallet?.name}`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 italic truncate max-w-50">
                                            {tx.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`font-bold text-lg ${tx.type === 'INCOME' ? 'text-emerald-400' :
                                                    tx.type === 'TRANSFER' ? 'text-blue-400' : 'text-rose-400'
                                                    }`}>
                                                    {tx.type === 'INCOME' ? '+' : '-'} Rp {Number(tx.amount).toLocaleString('id-ID')}
                                                </span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                                    <button onClick={() => openModal(tx)} className="text-slate-400 hover:text-white"><HiOutlinePencil size={16} /></button>
                                                    <button onClick={() => handleDelete(tx.id)} className="text-slate-400 hover:text-rose-500"><HiOutlineTrash size={16} /></button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
                        <span>Showing 1 - {itemsPerPage} from {data?.pagination.total} data</span>
                        <div className="flex gap-2">
                            {page > 1 && (
                                <button
                                    disabled={isLoading}
                                    onClick={() => setPage(page - 1)}
                                    className={`p-2 bg-slate-900 border border-slate-800 rounded-lg ${isLoading ? "cursor-not-allowed" : "cursor-pointer"} hover:bg-slate-800 hover:text-white transition disabled:opacity-50`}
                                >
                                    <HiChevronLeft />
                                </button>
                            )}

                            {visiblePages.map((p, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPage(p)}
                                    disabled={isLoading}
                                    className={`px-3 py-1 rounded-lg transition-all ${p === page ? "bg-slate-100 text-slate-950 font-semibold" : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white"} ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    {p}
                                </button>
                            ))}

                            {page < totalPages && (
                                <button
                                    disabled={isLoading}
                                    onClick={() => setPage(page + 1)}
                                    className={`p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    <HiChevronRight />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => openModal()} className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all z-50">
                <HiOutlinePlus className="w-8 h-8 text-white" />
            </button>

            <AnimatePresence>
                {isModalOpen && (
                    <RecordModal
                        investments={invData?.data ?? []}
                        onSubmit={onSubmit}
                        onClose={onModalClose}
                        isEditing={Boolean(selectedRecord)}
                        isPending={createPend || updatePend}
                        reactForm={reactForm}
                        wallets={wallData?.data ?? []}
                        categories={catData?.data ?? []}

                    />
                )}
            </AnimatePresence>
            <ConfirmModal
                isPending={deletePend}
                isOpen={isConfirmOpen}
                message='This action cannot be undone. All records linked to this records will lose.'
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onDelete}
            />
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    )
}