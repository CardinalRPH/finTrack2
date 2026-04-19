"use client"

import { IconRenderer } from '@/app/components/IconRenderer'
import React, { useState } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineXMark } from "react-icons/hi2"
import { Category } from './dto'
import CategoryModal from './components/CategoryModal'
import { AnimatePresence } from 'framer-motion'

// Mock Initial Data
const initialCategories: Category[] = [
    { id: '1', name: 'Food', icon: 'HiOutlineShoppingCart', color: '#EF4444' },
    { id: '2', name: 'Investment', icon: 'GiGoldBar', color: '#EAB308' },
]


export default function CategoriesPage() {
    const [categories, setCategories] = useState(initialCategories)
    const [isModalOpen, setModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<any>(null)

    // Handle Delete
    const handleDelete = (id: string) => {
        if (confirm("Are you sure? Transactions in this category will become 'Uncategorized'.")) {
            setCategories(categories.filter(c => c.id !== id))
        }
    }

    // Open Modal for Create or Edit
    const openModal = (category: Category | null = null) => {
        setEditingCategory(category)
        setModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Categories</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-2xl font-semibold transition-all"
                >
                    <HiOutlinePlus /> Add New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-slate-800" style={{ color: cat.color }}>
                                <IconRenderer iconName={cat.icon} className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-lg">{cat.name}</span>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(cat)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
                                <HiOutlinePencil size={18} />
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-rose-500/10 rounded-xl text-slate-400 hover:text-rose-500">
                                <HiOutlineTrash size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <AnimatePresence>

                {isModalOpen && (
                    <CategoryModal
                        category={editingCategory}
                        onClose={() => setModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}