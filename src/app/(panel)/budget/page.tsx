"use client";

import { useEffect, useState } from "react";
import {
    HiOutlinePlus,
    HiOutlineChartPie,
    HiOutlineTrendingUp,
    HiOutlineArrowSmDown
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { createBudgetSchema, createBudgetSchemaType, updateBudgetSchemaType } from "@/server/schemas/budgetSchema";
import { useSnackbar } from "@/stores/toastStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBudget, useDeleteBudget, useGetAvaiMonthYear, useGetBudget, useUpdateBudget } from "@/hooks/budgetHook";
import { useGetCategory } from "@/hooks/categoryHook";
import ConfirmModal from "../components/DialogModal";
import ErrorModal from "../components/ErrorModal";
import { CategoryBudgetCard } from "./components/BudgetCard";
import BudgetModal from "./components/BudgetModal";
import { BudgetStatCard } from "./components/BudgetStatCard";
import { formatToRupiah } from "@/utils/fomatCurrency";
import { BudgetSkeleton } from "./components/Skeleton";


const calculatePercentage = (value: number, limit: number) => {
    if (!value || !limit) return 0
    return (value / limit) * 100
}

const getPeriodValue = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}`;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export default function BudgetPage() {
    const [isModalOpen, setModalOpen] = useState(false)
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [selectedBudget, setSelectedBudget] = useState<updateBudgetSchemaType | null>(null)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [targetId, setTargetId] = useState<string | null>(null)
    const [selectedMonthYear, setSelectedMonthYear] = useState<Date>(new Date())

    const { data: monthYearData, error: mYErrMsg, isError: mYErr } = useGetAvaiMonthYear()
    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetBudget({ filter: { monthYear: selectedMonthYear } })
    const { data: catData, error: catErrMsg, isError: catErr } = useGetCategory()
    const { mutate: createBud, error: createErrMsg, isPending: createPend, isError: createErr, isSuccess: createScss } = useCreateBudget()
    const { mutate: updateBud, error: updateErrMsg, isPending: updatePend, isError: updateErr, isSuccess: updateScss } = useUpdateBudget()
    const { mutate: deleteBud, error: deleteErrMsg, isPending: deletePend, isError: deleteErr, isSuccess: deleteScss } = useDeleteBudget()

    const { show: showToast } = useSnackbar()


    const reactForm = useForm({
        resolver: zodResolver(createBudgetSchema)
    })
    const { reset, clearErrors } = reactForm

    const onDelete = () => {
        deleteBud({ id: targetId! })
    }

    const onSubmit = (value: createBudgetSchemaType) => {
        if (!selectedBudget) {
            createBud(value)
        } else {
            updateBud({ ...value, id: selectedBudget.id })
        }
    }

    const handleDelete = (id: string) => {
        setTargetId(id)
        setIsConfirmOpen(true)
    }

    // Open Modal for Create or Edit
    const openModal = (value: updateBudgetSchemaType | null = null) => {
        reset(value!)
        setSelectedBudget(value)
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
        if (mYErr) {
            setErrMdOpen(mYErr)
            setErrMsg(mYErrMsg.message)
        }

    }, [getErr, createErr, updateErr, deleteErr, catErr, mYErr])

    useEffect(() => {
        if (createScss) {
            setSelectedBudget(null)
            setModalOpen(false)
            showToast("Category Created", "success")
            reset()
        }
        if (updateScss) {
            setSelectedBudget(null)
            setModalOpen(false)
            showToast("Category Updated", "success")
            reset()
        }
        if (deleteScss) {
            setIsConfirmOpen(false)
            setTargetId(null)
            showToast("Category Deleted", "success")
        }
    }, [createScss, updateScss, deleteScss])


    if (isLoading) return <BudgetSkeleton />

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 pb-24">
            {/* HEADER SECTION */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                        Budgets <span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Monitor and limit your category spendings.</p>
                </div>

                {/* TIME SELECTOR */}
                {/* TIME SELECTOR (PERIOD SELECTOR) */}
                <div className="relative group">
                    <select
                        value={getPeriodValue(selectedMonthYear)}
                        onChange={(e) => {
                            const [y, m] = e.target.value.split("-").map(Number);
                            setSelectedMonthYear(new Date(y, m - 1, 1));
                        }}
                        className="appearance-none bg-slate-900/50 border border-slate-800 text-white text-xs font-bold px-5 py-3 pr-10 rounded-2xl backdrop-blur-md outline-none focus:border-indigo-500 transition-all cursor-pointer hover:bg-slate-800"
                    >
                        {monthYearData?.data.map((value, index) => (
                            <option
                                key={`availMonthyear-${index}`}
                                value={`${value.year}-${value.month}`} // Misal: "2026-5"
                                className="bg-slate-900 text-white"
                            >
                                {monthNames[value.month - 1]} {value.year}
                            </option>
                        ))}
                    </select>

                    {/* Custom Arrow Icon agar tetap cantik */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-indigo-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <BudgetStatCard
                    title="Total Budgeted"
                    amount={formatToRupiah(data?.data.totalBudget)}
                    icon={<HiOutlineChartPie size={20} />}
                    color="indigo"
                />
                <BudgetStatCard
                    title="Total Spent"
                    amount={formatToRupiah(data?.data.totalSpent)}
                    icon={<HiOutlineTrendingUp size={20} />}
                    color="emerald"
                    percentage={calculatePercentage(data?.data.totalSpent || 0, data?.data.totalBudget || 0)}
                />
                <BudgetStatCard
                    title="Remaining"
                    amount={formatToRupiah(data?.data.remaining)}
                    icon={<HiOutlineArrowSmDown size={20} />}
                    color="amber"
                />
            </div>

            {/* BUDGET LIST GRID */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contoh Data Budget Per Kategori */}
                {data?.data.budgetData.map((value, index) => (
                    <CategoryBudgetCard
                        key={`budCard-${index}`}
                        category={value.category.name}
                        limit={Number(value.amount)}
                        spent={value.spended}
                        color="#f43f5e"
                    />
                ))}
            </section>

            {/* FLOATING ACTION BUTTON */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => openModal()}
                className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:bg-indigo-500 z-40"
            >
                <HiOutlinePlus size={32} />
            </motion.button>

            {/* MODAL OVERLAY */}
            <AnimatePresence>
                {isModalOpen && (
                    <BudgetModal
                        categoryData={catData?.data ?? []}
                        isEditing={Boolean(selectedBudget)}
                        isPending={createPend || updatePend}
                        reactForm={reactForm}
                        onClose={onModalClose}
                        onSubmit={onSubmit}
                    />
                )}
            </AnimatePresence>
            <ConfirmModal
                isPending={deletePend}
                isOpen={isConfirmOpen}
                message='This action cannot be undone. All budget linked to this records will lose.'
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onDelete}
            />
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    );
}

