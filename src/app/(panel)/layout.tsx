"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
    HiOutlineHome, HiOutlineTag, HiOutlineArrowLeftOnRectangle,
    HiBars3, HiXMark, HiOutlineChartBar, HiOutlineWallet
} from "react-icons/hi2"
import { GiGoldBar } from "react-icons/gi"

const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: HiOutlineHome },
    { name: 'Wallets', href: '/wallets', icon: HiOutlineWallet },
    { name: 'Categories', href: '/categories', icon: HiOutlineTag },
    { name: 'Reports', href: '/reports', icon: HiOutlineChartBar },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex">
            {/* Sidebar - Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-2 mb-10 px-2">
                        <GiGoldBar className="text-2xl text-indigo-500" />
                        <span className="text-xl font-bold tracking-tight">FinTrack</span>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all"
                    >
                        <HiOutlineArrowLeftOnRectangle className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400">
                        {isSidebarOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
                    </button>

                    <div className="flex-1 lg:px-4">
                        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                            {menuItems.find(m => m.href === pathname)?.name || 'FinTrack'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">{session?.user?.name}</p>
                            <p className="text-xs text-slate-500">Free Tier</p>
                        </div>
                        {session?.user?.image && (
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-slate-800"
                            />
                        )}
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-950">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    )
}