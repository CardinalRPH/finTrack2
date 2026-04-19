"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HiOutlineHome, HiOutlineTag, HiOutlineWallet, HiOutlineDocumentText,
    HiOutlinePresentationChartLine, HiOutlineChartBar, HiChevronDown,
    HiOutlineArrowsRightLeft, HiChartPie,
    HiBars3, HiXMark,
    HiOutlineUserCircle,
    HiOutlineArrowLeftOnRectangle
} from "react-icons/hi2"
import { GiGoldBar } from "react-icons/gi"
import { signOut, useSession } from 'next-auth/react'
import { AnimatePresence, motion } from 'framer-motion'

const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: HiOutlineHome },
    { name: 'Record', href: '/records', icon: HiOutlineDocumentText },
    { name: 'Wallets', href: '/wallets', icon: HiOutlineWallet },
    { name: 'Categories', href: '/categories', icon: HiOutlineTag },
    { name: 'Investment', href: '/investment', icon: GiGoldBar },
]

const statisticSubItems = [
    { name: 'Balance', href: '/statistic/balance', icon: HiOutlinePresentationChartLine },
    { name: 'Cash-flow', href: '/statistic/cashflow', icon: HiOutlineArrowsRightLeft },
    { name: 'Spending', href: '/statistic/spending', icon: HiChartPie },
    { name: 'Reports', href: '/statistic/reports', icon: HiOutlineChartBar },
]
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [isStatsOpen, setStatsOpen] = useState(pathname.startsWith('/statistic'))
    const [isMobileOpen, setMobileOpen] = useState(false)
    const [isProfileOpen, setProfileOpen] = useState(false) // Desktop Popover State
    const [isMobileProfileOpen, setMobileProfileOpen] = useState(false) // Mobile List State

    const allItems = [...menuItems, ...statisticSubItems]
    const currentPage = allItems.find(item => item.href === pathname)?.name || "FinTrack"

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex overflow-hidden">
            {/* MOBILE HEADER */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-40 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-500">
                    <GiGoldBar size={24} />
                    <span className="text-lg font-bold text-white uppercase tracking-tighter">FinTrack</span>
                </div>
                <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-400">
                    <HiBars3 size={28} />
                </button>
            </div>

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300
                lg:relative lg:translate-x-0 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-10 px-2">
                        <div className="flex items-center gap-2 text-indigo-500">
                            <GiGoldBar size={28} />
                            <span className="text-xl font-bold text-white tracking-tight">FinTrack</span>
                        </div>
                        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400">
                            <HiXMark size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                        {menuItems.map((item) => (
                            <SidebarLink key={item.name} item={item} isActive={pathname === item.href} />
                        ))}

                        {/* Statistic Section */}
                        <div className="pt-2">
                            <button
                                onClick={() => setStatsOpen(!isStatsOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${pathname.startsWith('/statistic') ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <HiOutlineChartBar className="w-5 h-5" />
                                    <span className="font-medium">Statistic</span>
                                </div>
                                <HiChevronDown className={`w-4 h-4 transition-transform ${isStatsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isStatsOpen && (
                                <div className="mt-1 ml-4 pl-4 border-l border-slate-800 space-y-1">
                                    {statisticSubItems.map((sub) => (
                                        <SidebarLink key={sub.name} item={sub} isActive={pathname === sub.href} isSubItem />
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* MOBILE PROFILE SECTION (Bottom of Sidebar) */}
                    <div className="lg:hidden mt-auto pt-6 border-t border-slate-800">
                        <button
                            onClick={() => setMobileProfileOpen(!isMobileProfileOpen)}
                            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-800 transition-all"
                        >
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-10 h-10 rounded-xl border border-slate-700 object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white border border-slate-700">
                                    {session?.user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                            <div className="text-left flex-1">
                                <p className="text-sm font-bold">{session?.user?.name}</p>
                                <p className="text-xs text-slate-500">Free Tier</p>
                            </div>
                            <HiChevronDown className={`transition-transform ${isMobileProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isMobileProfileOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="py-2 space-y-1">
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl">
                                            <HiOutlineUserCircle size={20} />
                                            <span>Profile Settings</span>
                                        </button>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                        >
                                            <HiOutlineArrowLeftOnRectangle size={20} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </aside>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <header className="h-20 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl z-30 px-8 flex items-center justify-between shrink-0">
                    <h1 className="text-xl font-semibold tracking-tight hidden lg:block">{currentPage}</h1>
                    <div className="lg:hidden" /> {/* Spacer for mobile */}

                    {/* DESKTOP PROFILE POPOVER */}
                    <div className="hidden lg:block relative">
                        <button
                            onClick={() => setProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                        >
                            {session?.user?.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    className="w-10 h-10 rounded-xl border border-slate-700 object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white border border-slate-700">
                                    {session?.user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                            <HiChevronDown className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-800 mb-2">
                                            <p className="text-sm font-bold truncate">{session?.user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                                        </div>
                                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-xl transition-all">
                                            <HiOutlineUserCircle size={18} /> Profile Settings
                                        </button>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                        >
                                            <HiOutlineArrowLeftOnRectangle size={18} /> Sign Out
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <main className="flex-1 bg-slate-950 overflow-y-auto pt-16 lg:pt-0">
                    <div className="p-4 md:p-8">{children}</div>
                </main>
            </div>

            {isMobileOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
        </div>
    )
}

function SidebarLink({ item, isActive, isSubItem = false }: { item: any, isActive: boolean, isSubItem?: boolean }) {
    return (
        <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : isSubItem ? 'text-slate-500 hover:text-slate-200' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                } ${isSubItem ? 'text-sm px-4 py-2.5 rounded-xl' : ''}`}
        >
            <item.icon className={isSubItem ? "w-4 h-4" : "w-5 h-5"} />
            <span className="font-medium">{item.name}</span>
        </Link>
    )
}