"use client"

import { IconRenderer } from '@/app/components/IconRenderer'
import { useEffect, useState } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2"
import CategoryModal from './components/CategoryModal'
import { AnimatePresence } from 'framer-motion'
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryCreateSchema, categoryCreateSchemaType } from '@/server/schemas/categorySchema'
import { useCreateCategory, useDeleteCategory, useGetCategory, useUpdateCategory } from '@/hooks/categoryHook'
import ErrorModal from '../components/ErrorModal'
import { useSnackbar } from '@/stores/toastStore'
import ConfirmModal from '../components/DialogModal'
import { categoryDTO } from '@/server/dto/categoryDTO'


export default function CategoriesPage() {
    const [isModalOpen, setModalOpen] = useState(false)
    const [isErrMdOpen, setErrMdOpen] = useState(false)
    const [selectedCat, setSelectedCat] = useState<categoryDTO | null>(null)
    const [errMsg, setErrMsg] = useState<string | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [targetId, setTargetId] = useState<string | null>(null)

    const { show: showToast } = useSnackbar()

    const { data, isLoading, error: getErrMsg, isError: getErr } = useGetCategory()
    const { mutate: createCat, error: createErrMsg, isPending: createPend, isError: createErr, isSuccess: createScss } = useCreateCategory()
    const { mutate: updateCat, error: updateErrMsg, isPending: updatePend, isError: updateErr, isSuccess: updateScss } = useUpdateCategory()
    const { mutate: deleteCat, error: deleteErrMsg, isPending: deletePend, isError: deleteErr, isSuccess: deleteScss } = useDeleteCategory()

    const reactForm = useForm({
        resolver: zodResolver(categoryCreateSchema)
    })

    const { reset, clearErrors } = reactForm

    const onSubmit = (value: categoryCreateSchemaType) => {
        if (!selectedCat) {
            createCat(value)
        } else {
            updateCat({ ...value, id: selectedCat.id })
        }
    }

    const onDelete = () => {
        deleteCat({ id: targetId! })
    }


    // Handle Delete
    const handleDelete = (id: string) => {
        setTargetId(id)
        setIsConfirmOpen(true)
    }

    // Open Modal for Create or Edit
    const openModal = (category: categoryDTO | null = null) => {
        reset(category!)
        setSelectedCat(category)
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

    }, [getErr, createErr, updateErr, deleteErr])

    useEffect(() => {
        if (createScss) {
            setSelectedCat(null)
            setModalOpen(false)
            showToast("Category Created", "success")
            reset()
        }
        if (updateScss) {
            setSelectedCat(null)
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.data.map((cat) => (
                    <div key={cat.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-slate-800" style={{ color: cat.color! }}>
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
            {!isLoading && (
                <button
                    onClick={() => openModal()}
                    className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                >
                    <HiOutlinePlus className="w-8 h-8 transition-transform group-hover:rotate-90" />

                    {/* Tooltip */}
                    <span className="absolute right-20 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
                        Create New Category
                    </span>
                </button>
            )}
            <AnimatePresence>
                {isModalOpen && (
                    <CategoryModal
                        isPending={createPend || updatePend}
                        isEditing={Boolean(selectedCat)}
                        onClose={onModalClose}
                        reactForm={reactForm}
                        onSubmit={onSubmit}
                    />
                )}
            </AnimatePresence>
            <ConfirmModal
                isPending={deletePend}
                isOpen={isConfirmOpen}
                message='This action cannot be undone. All records linked to this category will lose their reference.'
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onDelete}
            />
            <ErrorModal isOpen={isErrMdOpen} onClose={() => setErrMdOpen(false)} message={errMsg || ""} />
        </div>
    )
}