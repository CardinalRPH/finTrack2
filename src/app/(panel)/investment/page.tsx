"use client"

import { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    Legend
} from 'recharts'
import {
    HiOutlinePlus,
    HiOutlineBriefcase,
    HiOutlineScale,
    HiOutlineCalendar,
    HiOutlinePencil,
    HiOutlineTrash
} from "react-icons/hi2"
import { AnimatePresence } from 'framer-motion'
import { formatToRupiah } from '@/utils/fomatCurrency'
import CreateInvestmentModal from './components/InvestmentModal'
import { useCreateInvest, useDeleteInvest, useGetInvestDashboard, useGetInvestYear, useUpdateInvest } from '@/hooks/investHook'
import { useSnackbar } from '@/stores/toastStore'
import { investCreateSchema, investCreateSchemaType, investUpdateSchemaType } from '@/server/schemas/investSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ErrorModal from '../components/ErrorModal'
import ConfirmModal from '../components/DialogModal'
import { InvestmentSkeleton } from './components/Skeleton'


const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ec4899'];

export default function InvestmentPage() {
    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const [selectedInvest, setSelectedInvest] = useState<investUpdateSchemaType | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [targetId, setTargetId] = useState<string | null>(null)

    const { data: yearData, error: yearErrMsg, isError: yearErr } = useGetInvestYear()
    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetInvestDashboard({ filter: { year: selectedYear } })
    const { mutate: createInv, error: createErrMsg, isPending: createPend, isError: createErr, isSuccess: createScss } = useCreateInvest()
    const { mutate: updateInv, error: updateErrMsg, isPending: updatePend, isError: updateErr, isSuccess: updateScss } = useUpdateInvest()
    const { mutate: deleteInv, error: deleteErrMsg, isPending: deletePend, isError: deleteErr, isSuccess: deleteScss } = useDeleteInvest()

    const { show: showToast } = useSnackbar()

    const reactForm = useForm({
        resolver: zodResolver(investCreateSchema)
    })
    const { reset, clearErrors } = reactForm

    const onDelete = () => {
        deleteInv({ id: targetId! })
    }

    const onSubmit = (value: investCreateSchemaType) => {
        if (!selectedInvest) {
            createInv(value)
        } else {
            updateInv({ ...value, id: selectedInvest.id })
        }
    }

    const handleDelete = (id: string) => {
        setTargetId(id)
        setIsConfirmOpen(true)
    }

    // Open Modal for Create or Edit
    const openModal = (value: investUpdateSchemaType | null = null) => {
        reset(value!)
        setSelectedInvest(value)
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
        if (yearErr) {
            setErrMdOpen(yearErr)
            setErrMsg(yearErrMsg.message)
        }

    }, [getErr, createErr, updateErr, deleteErr, yearErr])

    useEffect(() => {
        if (createScss) {
            setSelectedInvest(null)
            setModalOpen(false)
            showToast("Category Created", "success")
            reset()
        }
        if (updateScss) {
            setSelectedInvest(null)
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

    if (isLoading) return <InvestmentSkeleton />

    return (
        <div className="space-y-8 pb-24">
            {/* 1. Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-indigo-500/5 rotate-12"><HiOutlineBriefcase size={120} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Portfolio Value</p>
                    <h3 className="text-3xl font-black text-white">{formatToRupiah(data?.data.totalInvest)}</h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Assets</p>
                    <h3 className="text-3xl font-black text-white">{data?.data.list.length} <span className="text-sm font-medium text-slate-600 underline">Categories</span></h3>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter Year</p>
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 group-hover:scale-110 transition-transform">
                            <HiOutlineCalendar size={18} />
                        </div>
                    </div>

                    <div className="relative mt-4">
                        {/* Year Picker Dropdown */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 text-white text-sm font-bold rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                        >

                            {yearData?.data.map((value, index) => (
                                <option key={`invYear-${index}`} value={value}>
                                    Investment Year: {value}
                                </option>
                            ))}
                        </select>

                        {/* Custom Arrow Icon untuk Select */}
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Line Chart: Growth Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div className="bg-slate-900 border  border-slate-800 p-8 rounded-[3rem]">
                    <h3 className="text-xl font-black text-white mb-6">Asset Distribution</h3>
                    <div className="h-72 w-full flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data?.data.graph.chartData}
                                    cx="50%" cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {data?.data.graph.chartData && data.data.graph.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    formatter={(value: any) => {
                                        if (typeof value === 'number') {
                                            return [formatToRupiah(value), "Market Value"];
                                        }
                                        return [value, "Market Value"];
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem]">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-white">Investment Trend</h3>
                        <p className="text-xs text-slate-500 font-medium">Accumulated purchase value for {selectedYear}</p>
                    </div>
                    <div className="h-72 w-full flex-1">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data?.data.graph.lineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{payload[0].payload.name} {selectedYear}</p>
                                                    <p className="text-sm font-black text-indigo-400">{formatToRupiah(Number(payload[0].value))}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#0f172a' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


            {/* 3. List Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.data.list.map((inv, index) => (
                    <div key={inv.id} className="bg-slate-900 border group border-slate-800 p-6 rounded-4xl flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                <HiOutlineScale size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{inv.assetName}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{inv.provider}</p>
                            </div>
                        </div>
                        <div>
                            <div className="text-right">
                                <p className="font-black text-white">{formatToRupiah(inv.totalInvestment)}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(inv)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
                                    <HiOutlinePencil size={18} />
                                </button>
                                <button onClick={() => handleDelete(inv.id)} className="p-2 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-500">
                                    <HiOutlineTrash size={18} />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Float Add Button */}
            <button
                onClick={() => openModal()}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 transition-all active:scale-95 group"
            >
                <HiOutlinePlus size={32} className="group-hover:rotate-90 transition-transform" />
            </button>

            <AnimatePresence>
                {isModalOpen &&
                    <CreateInvestmentModal
                        isEditing={Boolean(selectedInvest)}
                        reactForm={reactForm}
                        onSubmit={onSubmit}
                        isPending={createPend || updatePend}
                        onClose={onModalClose}

                    />}
            </AnimatePresence>
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
            <ConfirmModal
                isPending={deletePend}
                isOpen={isConfirmOpen}
                message='This action cannot be undone. All records linked to this category will lose their reference.'
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onDelete}
            />
        </div>
    )
}