"use client"

import { useGetReport } from '@/hooks/statisticHook'
import { getStatisticSchemaType } from '@/server/schemas/statisticSchema'
import { useEffect, useState } from 'react'
import {
    HiOutlineDocumentChartBar,
    HiOutlineArrowDownTray,
    HiOutlineWallet,
    HiOutlineTag
} from "react-icons/hi2"
import ErrorModal from '../../components/ErrorModal'
import { formatToRupiah } from '@/utils/fomatCurrency'
import { ReportsSkeleton } from './components/Skeleton'

export default function ReportsPage() {
    const ranges = ['7D', '30D', '12W', '6M', '1Y']
    const [timeRange, setTimeRange] = useState<getStatisticSchemaType["range"]>('30D')
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>(null)

    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetReport({ filter: { range: timeRange } })

    useEffect(() => {
        if (getErr) {
            setErrMdOpen(getErr)
            setErrMsg(getErrMsg.message)
        }
    }, [getErr])

    if (isLoading) return <ReportsSkeleton />

    return (
        <div className="space-y-8 pb-16">
            {/* Header & Export */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Financial Reports</h2>
                    <p className="text-slate-500 text-sm">Detailed breakdown of your financial activity</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                        {ranges.map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range as getStatisticSchemaType["range"])}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
                        <HiOutlineArrowDownTray size={18} /> Export
                    </button>
                </div>
            </div>

            {/* 1. Quick Review Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <h3 className="font-bold flex items-center gap-2"><HiOutlineDocumentChartBar className="text-indigo-500" /> Quick Review</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 bg-slate-950/30">
                                <th className="px-8 py-4">Metrics</th>
                                <th className="px-8 py-4 text-emerald-500">Income</th>
                                <th className="px-8 py-4 text-rose-500">Expenses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <tr className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-8 py-4 text-sm font-medium text-slate-400">Transaction Count</td>
                                <td className="px-8 py-4 font-bold">{data?.data.metrics.income.count} Records</td>
                                <td className="px-8 py-4 font-bold">{data?.data.metrics.expenses.count} Records</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-8 py-4 text-sm font-medium text-slate-400">Average (per Day)</td>
                                <td className="px-8 py-4 font-bold text-emerald-400">{formatToRupiah(data?.data.metrics.income.averagePerDay)}</td>
                                <td className="px-8 py-4 font-bold text-rose-400">{formatToRupiah(data?.data.metrics.expenses.averagePerDay)}</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-8 py-4 text-sm font-medium text-slate-400">Average (per Record)</td>
                                <td className="px-8 py-4 font-bold text-emerald-400">{formatToRupiah(data?.data.metrics.income.averagePerRecord)}</td>
                                <td className="px-8 py-4 font-bold text-rose-400">{formatToRupiah(data?.data.metrics.expenses.averagePerRecord)}</td>
                            </tr>
                            <tr className="bg-slate-950/50">
                                <td className="px-8 py-5 text-sm font-black text-white uppercase">Total Amount</td>
                                <td className="px-8 py-5 text-xl font-black text-emerald-400">{formatToRupiah(data?.data.metrics.income.totalAmount)}</td>
                                <td className="px-8 py-5 text-xl font-black text-rose-400">{formatToRupiah(data?.data.metrics.expenses.totalAmount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Total Cash Flow Banner */}
                <div className="bg-indigo-600 p-6 flex justify-between items-center">
                    <span className="font-black uppercase tracking-tighter text-white/80">Total Net Cash Flow</span>
                    <span className="text-2xl font-black text-white">{formatToRupiah(data?.data.metrics.netCashFlow)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. Breakdown by Wallet */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2 font-bold">
                        <HiOutlineWallet size={20} className="text-indigo-400" /> By Wallet
                    </div>
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/30">
                            <tr>
                                <th className="px-6 py-3">Account</th>
                                <th className="px-6 py-3">In</th>
                                <th className="px-6 py-3 text-right">Out</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {data && data.data.byWallet.map((value, index) => (
                                <tr className="hover:bg-slate-800/20" key={`byWallet-${index}`}>
                                    <td className="px-6 py-4 font-bold">{value.name}</td>
                                    <td className="px-6 py-4 text-emerald-500">{formatToRupiah(value.in)}</td>
                                    <td className="px-6 py-4 text-rose-500 text-right">{formatToRupiah(value.out)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Breakdown by Category */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2 font-bold">
                        <HiOutlineTag size={20} className="text-indigo-400" /> By Category
                    </div>
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/30">
                            <tr>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">In</th>
                                <th className="px-6 py-3 text-right">Out</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {data && data.data.byCategory.map((value, index) => (
                                <tr className="hover:bg-slate-800/20" key={`byCategory-${index}`}>
                                    <td className="px-6 py-4 font-bold">{value.name}</td>
                                    <td className="px-6 py-4 text-emerald-500">{formatToRupiah(value.in)}</td>
                                    <td className="px-6 py-4 text-rose-500 text-right">{formatToRupiah(value.out)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    )
}